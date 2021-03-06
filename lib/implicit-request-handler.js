"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var appauth_1 = require("@openid/appauth");
var implicit_request_1 = require("./implicit-request");
/** key for implicit request. */
var implicitRequestKey = function (handle) {
    return handle + "_appauth_implicit_request";
};
/** key in local storage which represents the current implicit request. */
var IMPLICIT_REQUEST_HANDLE_KEY = 'appauth_current_implicit_request';
exports.IMPLICIT_RESPONSE_KEY = "implicit_response";
/**
 * Implicit Service notifier.
 * This manages the communication of the TokenResponse to the 3p client.
 */
var ImplicitNotifier = /** @class */ (function () {
    function ImplicitNotifier() {
        this.listener = null;
    }
    ImplicitNotifier.prototype.setImplicitListener = function (listener) {
        this.listener = listener;
    };
    /**
     * The Implicit complete callback.
     */
    ImplicitNotifier.prototype.onImplicitComplete = function (request, response, error) {
        if (this.listener) {
            // complete Implicit request
            this.listener(request, response, error);
        }
    };
    return ImplicitNotifier;
}());
exports.ImplicitNotifier = ImplicitNotifier;
// TODO(rahulrav@): add more built in parameters.
/* built in parameters. */
exports.BUILT_IN_PARAMETERS = ['redirect_uri', 'client_id', 'response_type', 'state', 'scope'];
/**
 * Defines the interface which is capable of handling an Implicit request
 * using various methods (iframe / popup / different process etc.).
 */
var ImplicitRequestHandler = /** @class */ (function () {
    function ImplicitRequestHandler(utils, crypto) {
        this.utils = utils;
        this.crypto = crypto;
        // notifier send the response back to the client.
        this.notifier = null;
    }
    /**
     * A utility method to be able to build the Implicit request URL.
     */
    ImplicitRequestHandler.prototype.buildRequestUrl = function (configuration, request) {
        // build the query string
        // coerce to any type for convenience
        var requestMap = {
            'redirect_uri': request.redirectUri,
            'client_id': request.clientId,
            'response_type': request.responseType,
            'state': request.state,
            'scope': request.scope,
            'nonce': request.nonce
        };
        // copy over extras
        if (request.extras) {
            for (var extra in request.extras) {
                if (request.extras.hasOwnProperty(extra)) {
                    // check before inserting to requestMap
                    if (exports.BUILT_IN_PARAMETERS.indexOf(extra) < 0) {
                        requestMap[extra] = request.extras[extra];
                    }
                }
            }
        }
        var query = this.utils.stringify(requestMap);
        var baseUrl = configuration.authorizationEndpoint;
        var url = baseUrl + "?" + query;
        return url;
    };
    /**
     * Completes the Implicit request if necessary & when possible.
     */
    ImplicitRequestHandler.prototype.completeImplicitRequestIfPossible = function () {
        var _this = this;
        // call complete Implicit if possible to see there might
        // be a response that needs to be delivered.
        appauth_1.log("Checking to see if there is an Implicit response to be delivered.");
        if (!this.notifier) {
            appauth_1.log("Notifier is not present on ImplicitRequest handler.\n          No delivery of result will be possible");
        }
        return this.completeImplicitRequest().then(function (result) {
            if (!result) {
                appauth_1.log("No result is available yet.");
            }
            if (result && _this.notifier) {
                _this.notifier.onImplicitComplete(result.request, result.response, result.error);
            }
        });
    };
    /**
     * Sets the default Implicit Service notifier.
     */
    ImplicitRequestHandler.prototype.setImplicitNotifier = function (notifier) {
        this.notifier = notifier;
        return this;
    };
    ;
    return ImplicitRequestHandler;
}());
exports.ImplicitRequestHandler = ImplicitRequestHandler;
var IonicImplicitRequestHandler = /** @class */ (function (_super) {
    __extends(IonicImplicitRequestHandler, _super);
    function IonicImplicitRequestHandler(browser, storage, utils, generateRandom) {
        if (utils === void 0) { utils = new appauth_1.BasicQueryStringUtils(); }
        if (generateRandom === void 0) { generateRandom = new appauth_1.DefaultCrypto(); }
        var _this = _super.call(this, utils, generateRandom) || this;
        _this.browser = browser;
        _this.storage = storage;
        _this.generateRandom = generateRandom;
        return _this;
    }
    IonicImplicitRequestHandler.prototype.performImplicitRequest = function (configuration, request) {
        return __awaiter(this, void 0, void 0, function () {
            var handle, _a, _b, _c, _d, _e, url, returnedUrl;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        handle = this.generateRandom.generateRandom(10);
                        this.storage.setItem(IMPLICIT_REQUEST_HANDLE_KEY, handle);
                        _b = (_a = this.storage).setItem;
                        _c = [implicitRequestKey(handle)];
                        _e = (_d = JSON).stringify;
                        return [4 /*yield*/, request.toJson()];
                    case 1:
                        _b.apply(_a, _c.concat([_e.apply(_d, [_f.sent()])]));
                        url = this.buildRequestUrl(configuration, request);
                        return [4 /*yield*/, this.browser.showWindow(url, request.redirectUri)];
                    case 2:
                        returnedUrl = _f.sent();
                        if (!(returnedUrl != undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.storage.setItem(exports.IMPLICIT_RESPONSE_KEY, url)];
                    case 3:
                        _f.sent();
                        this.completeImplicitRequest();
                        _f.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IonicImplicitRequestHandler.prototype.completeImplicitRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var handle, request, _a, queryParams, _b, state, error;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.storage.getItem(IMPLICIT_REQUEST_HANDLE_KEY)];
                    case 1:
                        handle = _c.sent();
                        if (!handle) {
                            throw new Error("Handle Not Available");
                        }
                        _a = this.getImplicitRequest;
                        return [4 /*yield*/, this.storage.getItem(implicitRequestKey(handle))];
                    case 2:
                        request = _a.apply(this, [_c.sent()]);
                        _b = this.getQueryParams;
                        return [4 /*yield*/, this.storage.getItem(exports.IMPLICIT_RESPONSE_KEY)];
                    case 3:
                        queryParams = _b.apply(this, [_c.sent()]);
                        this.removeItemsFromStorage(handle);
                        state = queryParams['state'];
                        error = queryParams['error'];
                        if (state !== request.state) {
                            throw new Error("State Does Not Match");
                        }
                        return [2 /*return*/, {
                                request: request,
                                response: (!error) ? this.getImplicitResponse(queryParams) : null,
                                error: (error) ? this.getImplicitError(queryParams) : null
                            }];
                }
            });
        });
    };
    IonicImplicitRequestHandler.prototype.getImplicitRequest = function (authRequest) {
        if (authRequest == null) {
            throw new Error("No Auth Request Available");
        }
        return new implicit_request_1.ImplicitRequest(JSON.parse(authRequest));
    };
    IonicImplicitRequestHandler.prototype.getImplicitError = function (queryParams) {
        var implicitErrorJSON = {
            error: this.convertToErrorType(queryParams['error']),
            error_description: queryParams['error_description'],
            error_uri: undefined
        };
        return new appauth_1.TokenError(implicitErrorJSON);
    };
    IonicImplicitRequestHandler.prototype.getImplicitResponse = function (queryParams) {
        var implicitResponseJSON = {
            access_token: queryParams['access_token'],
            token_type: this.convertToTokenType(queryParams['token_type']),
            expires_in: +queryParams['expires_in'],
            refresh_token: queryParams['refresh_token'],
            scope: queryParams['scope'],
            id_token: queryParams['id_token'],
            issued_at: +queryParams['issued_at']
        };
        return new appauth_1.TokenResponse(implicitResponseJSON);
    };
    IonicImplicitRequestHandler.prototype.convertToTokenType = function (type) {
        return (type == 'bearer' || type == 'mac') ? type : undefined;
    };
    IonicImplicitRequestHandler.prototype.convertToErrorType = function (type) {
        return (type == 'invalid_request' || type == 'invalid_client' || type == 'invalid_grant' || type == 'unauthorized_client' || type == 'unsupported_grant_type' || type == 'invalid_scope') ? type : 'invalid_request';
    };
    IonicImplicitRequestHandler.prototype.removeItemsFromStorage = function (handle) {
        this.storage.removeItem(IMPLICIT_REQUEST_HANDLE_KEY);
        this.storage.removeItem(implicitRequestKey(handle));
        this.storage.removeItem(exports.IMPLICIT_RESPONSE_KEY);
    };
    IonicImplicitRequestHandler.prototype.getQueryParams = function (authResponse) {
        if (authResponse != null) {
            var parts = authResponse.split('#');
            if (parts.length !== 2)
                throw new Error("Invalid auth response string");
            var hash = parts[1];
            return this.utils.parseQueryString(hash);
        }
        else {
            return {};
        }
    };
    return IonicImplicitRequestHandler;
}(ImplicitRequestHandler));
exports.IonicImplicitRequestHandler = IonicImplicitRequestHandler;
