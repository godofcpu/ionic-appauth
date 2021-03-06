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
/** key for authorization request. */
var authorizationRequestKey = function (handle) {
    return handle + "_appauth_authorization_request";
};
/** key in local storage which represents the current authorization request. */
var AUTHORIZATION_REQUEST_HANDLE_KEY = 'appauth_current_authorization_request';
exports.AUTHORIZATION_RESPONSE_KEY = "auth_response";
var IonicAuthorizationRequestHandler = /** @class */ (function (_super) {
    __extends(IonicAuthorizationRequestHandler, _super);
    function IonicAuthorizationRequestHandler(browser, storage, utils, generateRandom) {
        if (utils === void 0) { utils = new appauth_1.BasicQueryStringUtils(); }
        if (generateRandom === void 0) { generateRandom = new appauth_1.DefaultCrypto(); }
        var _this = _super.call(this, utils, generateRandom) || this;
        _this.browser = browser;
        _this.storage = storage;
        _this.generateRandom = generateRandom;
        return _this;
    }
    IonicAuthorizationRequestHandler.prototype.performAuthorizationRequest = function (configuration, request) {
        return __awaiter(this, void 0, void 0, function () {
            var handle, _a, _b, _c, _d, _e, url, returnedUrl;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        handle = this.generateRandom.generateRandom(10);
                        this.storage.setItem(AUTHORIZATION_REQUEST_HANDLE_KEY, handle);
                        _b = (_a = this.storage).setItem;
                        _c = [authorizationRequestKey(handle)];
                        _e = (_d = JSON).stringify;
                        return [4 /*yield*/, request.toJson()];
                    case 1:
                        _b.apply(_a, _c.concat([_e.apply(_d, [_f.sent()])]));
                        url = this.buildRequestUrl(configuration, request);
                        return [4 /*yield*/, this.browser.showWindow(url, request.redirectUri)];
                    case 2:
                        returnedUrl = _f.sent();
                        if (!(returnedUrl != undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.storage.setItem(exports.AUTHORIZATION_RESPONSE_KEY, url)];
                    case 3:
                        _f.sent();
                        this.completeAuthorizationRequest();
                        _f.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IonicAuthorizationRequestHandler.prototype.completeAuthorizationRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var handle, request, _a, queryParams, _b, state, error;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.storage.getItem(AUTHORIZATION_REQUEST_HANDLE_KEY)];
                    case 1:
                        handle = _c.sent();
                        if (!handle) {
                            throw new Error("Handle Not Available");
                        }
                        _a = this.getAuthorizationRequest;
                        return [4 /*yield*/, this.storage.getItem(authorizationRequestKey(handle))];
                    case 2:
                        request = _a.apply(this, [_c.sent()]);
                        _b = this.getQueryParams;
                        return [4 /*yield*/, this.storage.getItem(exports.AUTHORIZATION_RESPONSE_KEY)];
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
                                response: (!error) ? this.getAuthorizationResponse(queryParams) : undefined,
                                error: (error) ? this.getAuthorizationError(queryParams) : undefined
                            }];
                }
            });
        });
    };
    IonicAuthorizationRequestHandler.prototype.getAuthorizationRequest = function (authRequest) {
        if (authRequest == null) {
            throw new Error("No Auth Request Available");
        }
        return new appauth_1.AuthorizationRequest(JSON.parse(authRequest));
    };
    IonicAuthorizationRequestHandler.prototype.getAuthorizationError = function (queryParams) {
        var authorizationErrorJSON = {
            error: queryParams['error'],
            error_description: queryParams['error_description'],
            error_uri: undefined,
            state: queryParams['state']
        };
        return new appauth_1.AuthorizationError(authorizationErrorJSON);
    };
    IonicAuthorizationRequestHandler.prototype.getAuthorizationResponse = function (queryParams) {
        var authorizationResponseJSON = {
            code: queryParams['code'],
            state: queryParams['state']
        };
        return new appauth_1.AuthorizationResponse(authorizationResponseJSON);
    };
    IonicAuthorizationRequestHandler.prototype.removeItemsFromStorage = function (handle) {
        this.storage.removeItem(AUTHORIZATION_REQUEST_HANDLE_KEY);
        this.storage.removeItem(authorizationRequestKey(handle));
        this.storage.removeItem(exports.AUTHORIZATION_RESPONSE_KEY);
    };
    IonicAuthorizationRequestHandler.prototype.getQueryParams = function (authResponse) {
        if (authResponse != null) {
            var querySide = authResponse.split('#')[0];
            var parts = querySide.split('?');
            if (parts.length !== 2)
                throw new Error("Invalid auth response string");
            var hash = parts[1];
            return this.utils.parseQueryString(hash);
        }
        else {
            return {};
        }
    };
    return IonicAuthorizationRequestHandler;
}(appauth_1.AuthorizationRequestHandler));
exports.IonicAuthorizationRequestHandler = IonicAuthorizationRequestHandler;
