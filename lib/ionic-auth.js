"use strict";
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
var auth_action_1 = require("./auth-action");
var user_info_request_handler_1 = require("./user-info-request-handler");
var end_session_request_handler_1 = require("./end-session-request-handler");
var authorization_request_handler_1 = require("./authorization-request-handler");
var auth_browser_1 = require("./auth-browser");
var appauth_2 = require("@openid/appauth");
var end_session_request_1 = require("./end-session-request");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var implicit_request_handler_1 = require("./implicit-request-handler");
var implicit_request_1 = require("./implicit-request");
var TOKEN_RESPONSE_KEY = "token_response";
var AUTH_EXPIRY_BUFFER = 10 * 60 * -1; // 10 mins in seconds
var IS_VALID_BUFFER_KEY = 'isValidBuffer';
var BaseIonicAuth = /** @class */ (function () {
    function BaseIonicAuth() {
    }
    BaseIonicAuth.prototype.signIn = function (loginHint) {
        throw new Error("Method not implemented.");
    };
    BaseIonicAuth.prototype.signOut = function () {
        throw new Error("Method not implemented.");
    };
    BaseIonicAuth.prototype.getUserInfo = function () {
        throw new Error("Method not implemented.");
    };
    BaseIonicAuth.prototype.startUpAsync = function () {
        throw new Error("Method not implemented.");
    };
    BaseIonicAuth.prototype.AuthorizationCallBack = function (url) {
        throw new Error("Method not implemented.");
    };
    BaseIonicAuth.prototype.EndSessionCallBack = function () {
        throw new Error("Method not implemented.");
    };
    BaseIonicAuth.prototype.requestRefreshToken = function (tokenResponse) {
        throw new Error("Method not implemented.");
    };
    BaseIonicAuth.prototype.getValidToken = function () {
        throw new Error("Method not implemented.");
    };
    return BaseIonicAuth;
}());
exports.BaseIonicAuth = BaseIonicAuth;
exports.NullIonicAuthObject = new BaseIonicAuth();
var IonicAuth = /** @class */ (function () {
    function IonicAuth(browser, storage, requestor, tokenHandler, userInfoHandler, requestHandler, endSessionHandler) {
        if (browser === void 0) { browser = new auth_browser_1.DefaultBrowser(); }
        if (storage === void 0) { storage = new appauth_2.LocalStorageBackend(); }
        if (requestor === void 0) { requestor = new appauth_2.JQueryRequestor(); }
        if (tokenHandler === void 0) { tokenHandler = new appauth_2.BaseTokenRequestHandler(requestor); }
        if (userInfoHandler === void 0) { userInfoHandler = new user_info_request_handler_1.IonicUserInfoHandler(requestor); }
        if (requestHandler === void 0) { requestHandler = new authorization_request_handler_1.IonicAuthorizationRequestHandler(browser, storage); }
        if (endSessionHandler === void 0) { endSessionHandler = new end_session_request_handler_1.IonicEndSessionHandler(browser); }
        this.browser = browser;
        this.storage = storage;
        this.requestor = requestor;
        this.tokenHandler = tokenHandler;
        this.userInfoHandler = userInfoHandler;
        this.requestHandler = requestHandler;
        this.endSessionHandler = endSessionHandler;
        this.authSubject = new rxjs_1.BehaviorSubject(auth_action_1.AuthActionBuilder.Default());
        this.authObservable = this.authSubject.asObservable();
        this.setupNotifier();
    }
    IonicAuth.prototype.getAuthConfig = function () {
        if (!this.authConfig)
            throw new Error("AuthConfig Not Defined");
        return this.authConfig;
    };
    IonicAuth.prototype.setupNotifier = function () {
        var _this = this;
        if (this.requestHandler instanceof appauth_1.AuthorizationRequestHandler) {
            var notifier = new appauth_2.AuthorizationNotifier();
            this.requestHandler.setAuthorizationNotifier(notifier);
            notifier.setAuthorizationListener(function (request, response, error) { return _this.onAuthorizationNotification(request, response, error); });
        }
        else {
            var notifier = new implicit_request_handler_1.ImplicitNotifier();
            this.requestHandler.setImplicitNotifier(notifier);
            notifier.setImplicitListener(function (request, response, error) { return _this.onImplicitNotification(request, response, error); });
        }
    };
    IonicAuth.prototype.onImplicitNotification = function (request, response, error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(response != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storage.setItem(TOKEN_RESPONSE_KEY, JSON.stringify(response.toJson()))];
                    case 1:
                        _a.sent();
                        this.authSubject.next(auth_action_1.AuthActionBuilder.SignInSuccess(response));
                        return [3 /*break*/, 3];
                    case 2:
                        if (error != null) {
                            throw new Error(error.errorDescription);
                        }
                        else {
                            throw new Error("Unknown Error With Authentication");
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    IonicAuth.prototype.onAuthorizationNotification = function (request, response, error) {
        var codeVerifier = (request.internal != undefined && this.getAuthConfig().usePkce) ? request.internal.code_verifier : undefined;
        if (response != null) {
            this.requestAccessToken(response.code, codeVerifier);
        }
        else if (error != null) {
            throw new Error(error.errorDescription);
        }
        else {
            throw new Error("Unknown Error With Authentication");
        }
    };
    IonicAuth.prototype.signIn = function (loginHint) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.performAuthorizationRequest(loginHint).catch(function (response) {
                            _this.authSubject.next(auth_action_1.AuthActionBuilder.SignInFailed(response));
                            throw response;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IonicAuth.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.performEndSessionRequest().catch(function (response) {
                            _this.authSubject.next(auth_action_1.AuthActionBuilder.SignOutFailed(response));
                            throw response;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IonicAuth.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getValidToken()];
                    case 1:
                        token = _c.sent();
                        if (!(token != undefined)) return [3 /*break*/, 3];
                        _b = (_a = this.userInfoHandler).performUserInfoRequest;
                        return [4 /*yield*/, this.getConfiguration()];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent(), token])];
                    case 3: throw new Error("Unable To Obtain User Info - No Token Available");
                }
            });
        });
    };
    IonicAuth.prototype.startUpAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, tokenResponseString;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //subscribing to auth observable for event hooks
                        this.authObservable.subscribe(function (action) { return _this.authObservableEvents(action); });
                        return [4 /*yield*/, this.storage.getItem(TOKEN_RESPONSE_KEY)];
                    case 1:
                        tokenResponseString = _a.sent();
                        if (!(tokenResponseString != null)) return [3 /*break*/, 3];
                        token = new appauth_2.TokenResponse(JSON.parse(tokenResponseString));
                        if (!(token && !token.isValid())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.requestNewToken(token)];
                    case 2:
                        token = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!token) {
                            this.authSubject.next(auth_action_1.AuthActionBuilder.AutoSignInFailed("No Token Available"));
                        }
                        else {
                            this.authSubject.next(auth_action_1.AuthActionBuilder.AutoSignInSuccess(token));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    IonicAuth.prototype.AuthorizationCallBack = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.browser.closeWindow();
                        if (!(this.requestHandler instanceof appauth_1.AuthorizationRequestHandler)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storage.setItem(authorization_request_handler_1.AUTHORIZATION_RESPONSE_KEY, url)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.requestHandler.completeAuthorizationRequestIfPossible()];
                    case 2: return [4 /*yield*/, this.storage.setItem(implicit_request_handler_1.IMPLICIT_RESPONSE_KEY, url)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.requestHandler.completeImplicitRequestIfPossible()];
                }
            });
        });
    };
    IonicAuth.prototype.EndSessionCallBack = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.browser.closeWindow();
                this.storage.removeItem(TOKEN_RESPONSE_KEY);
                this.authSubject.next(auth_action_1.AuthActionBuilder.SignOutSuccess());
                return [2 /*return*/];
            });
        });
    };
    IonicAuth.prototype.performEndSessionRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, requestJson, request, returnedUrl, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getTokenFromObserver()];
                    case 1:
                        token = _c.sent();
                        if (!(token != undefined)) return [3 /*break*/, 4];
                        requestJson = {
                            postLogoutRedirectURI: this.getAuthConfig().end_session_redirect_url,
                            idTokenHint: token.idToken || ''
                        };
                        request = new end_session_request_1.EndSessionRequest(requestJson);
                        _b = (_a = this.endSessionHandler).performEndSessionRequest;
                        return [4 /*yield*/, this.getConfiguration()];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(), request])];
                    case 3:
                        returnedUrl = _c.sent();
                        //callback may come from showWindow or via another method
                        if (returnedUrl != undefined) {
                            this.EndSessionCallBack();
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        //if user has no token they should not be logged in in the first place
                        this.EndSessionCallBack();
                        _c.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    IonicAuth.prototype.performAuthorizationRequest = function (loginHint) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!(this.requestHandler instanceof appauth_1.AuthorizationRequestHandler)) return [3 /*break*/, 3];
                        _b = (_a = this.requestHandler).performAuthorizationRequest;
                        return [4 /*yield*/, this.getConfiguration()];
                    case 1:
                        _c = [_g.sent()];
                        return [4 /*yield*/, this.getAuthorizationRequest(loginHint)];
                    case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_g.sent()]))];
                    case 3:
                        _e = (_d = this.requestHandler).performImplicitRequest;
                        return [4 /*yield*/, this.getConfiguration()];
                    case 4:
                        _f = [_g.sent()];
                        return [4 /*yield*/, this.getImplicitRequest(loginHint)];
                    case 5: return [2 /*return*/, _e.apply(_d, _f.concat([_g.sent()]))];
                }
            });
        });
    };
    IonicAuth.prototype.getAuthorizationRequest = function (loginHint) {
        return __awaiter(this, void 0, void 0, function () {
            var authConfig, requestJson, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authConfig = this.getAuthConfig();
                        requestJson = {
                            response_type: authConfig.response_type || appauth_2.AuthorizationRequest.RESPONSE_TYPE_CODE,
                            client_id: authConfig.identity_client,
                            redirect_uri: authConfig.redirect_url,
                            scope: authConfig.scopes,
                            extras: authConfig.auth_extras
                        };
                        if (loginHint) {
                            requestJson.extras = requestJson.extras || {};
                            requestJson.extras['login_hint'] = loginHint;
                        }
                        request = new appauth_2.AuthorizationRequest(requestJson, new appauth_2.DefaultCrypto(), authConfig.usePkce);
                        if (!authConfig.usePkce) return [3 /*break*/, 2];
                        return [4 /*yield*/, request.setupCodeVerifier()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, request];
                }
            });
        });
    };
    IonicAuth.prototype.getImplicitRequest = function (loginHint) {
        return __awaiter(this, void 0, void 0, function () {
            var authConfig, requestJson;
            return __generator(this, function (_a) {
                authConfig = this.getAuthConfig();
                requestJson = {
                    response_type: authConfig.response_type || implicit_request_1.ImplicitResponseType.IdTokenToken,
                    client_id: authConfig.identity_client,
                    redirect_uri: authConfig.redirect_url,
                    scope: authConfig.scopes,
                    extras: authConfig.auth_extras
                };
                if (loginHint) {
                    requestJson.extras = requestJson.extras || {};
                    requestJson.extras['login_hint'] = loginHint;
                }
                return [2 /*return*/, new implicit_request_1.ImplicitRequest(requestJson, new appauth_2.DefaultCrypto())];
            });
        });
    };
    IonicAuth.prototype.getConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.configuration) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, appauth_2.AuthorizationServiceConfiguration.fetchFromIssuer(this.getAuthConfig().identity_server, this.requestor).catch(function () { return undefined; })];
                    case 1:
                        _a.configuration = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (this.configuration != undefined) {
                            return [2 /*return*/, this.configuration];
                        }
                        else {
                            throw new Error("Unable To Obtain Server Configuration");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    IonicAuth.prototype.requestAccessToken = function (code, codeVerifier) {
        return __awaiter(this, void 0, void 0, function () {
            var authConfig, requestJSON, token, _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        authConfig = this.getAuthConfig();
                        requestJSON = {
                            grant_type: appauth_2.GRANT_TYPE_AUTHORIZATION_CODE,
                            code: code,
                            refresh_token: undefined,
                            redirect_uri: authConfig.redirect_url,
                            client_id: authConfig.identity_client,
                            extras: (codeVerifier) ? {
                                "code_verifier": codeVerifier
                            } : {}
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        _b = (_a = this.tokenHandler).performTokenRequest;
                        return [4 /*yield*/, this.getConfiguration()];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(), new appauth_2.TokenRequest(requestJSON)])];
                    case 3:
                        token = _c.sent();
                        return [4 /*yield*/, this.storage.setItem(TOKEN_RESPONSE_KEY, JSON.stringify(token.toJson()))];
                    case 4:
                        _c.sent();
                        this.authSubject.next(auth_action_1.AuthActionBuilder.SignInSuccess(token));
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _c.sent();
                        this.authSubject.next(auth_action_1.AuthActionBuilder.SignInFailed(error_1));
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    IonicAuth.prototype.requestRefreshToken = function (tokenResponse) {
        return __awaiter(this, void 0, void 0, function () {
            var authConfig, requestJSON, token, _a, _b, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        authConfig = this.getAuthConfig();
                        requestJSON = {
                            grant_type: appauth_2.GRANT_TYPE_REFRESH_TOKEN,
                            code: undefined,
                            refresh_token: tokenResponse.refreshToken,
                            redirect_uri: authConfig.redirect_url,
                            client_id: authConfig.identity_client,
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        _b = (_a = this.tokenHandler).performTokenRequest;
                        return [4 /*yield*/, this.getConfiguration()];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(), new appauth_2.TokenRequest(requestJSON)])];
                    case 3:
                        token = _c.sent();
                        return [4 /*yield*/, this.storage.setItem(TOKEN_RESPONSE_KEY, JSON.stringify(token.toJson()))];
                    case 4:
                        _c.sent();
                        this.authSubject.next(auth_action_1.AuthActionBuilder.RefreshSuccess(token));
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _c.sent();
                        this.storage.removeItem(TOKEN_RESPONSE_KEY);
                        this.authSubject.next(auth_action_1.AuthActionBuilder.RefreshFailed(error_2));
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    IonicAuth.prototype.getValidToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, isValidBuffer, authConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTokenFromObserver()];
                    case 1:
                        token = _a.sent();
                        if (token == undefined)
                            throw new Error("Unable To Obtain Token - No Token Available");
                        isValidBuffer = AUTH_EXPIRY_BUFFER;
                        authConfig = this.getAuthConfig();
                        // See if a IS_VALID_BUFFER_KEY is specified in the config extras,
                        // to specify a buffer parameter for token.isValid().
                        if (authConfig.auth_extras) {
                            if (authConfig.auth_extras.hasOwnProperty(IS_VALID_BUFFER_KEY)) {
                                isValidBuffer = parseInt(authConfig.auth_extras[IS_VALID_BUFFER_KEY], 10);
                            }
                        }
                        if (!!token.isValid(isValidBuffer)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.requestNewToken(token)];
                    case 2:
                        token = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, token];
                }
            });
        });
    };
    IonicAuth.prototype.requestNewToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestRefreshToken(token)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getTokenFromObserver()];
                }
            });
        });
    };
    IonicAuth.prototype.getTokenFromObserver = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.authSubject.pipe(operators_1.take(1)).toPromise().then(function (action) { return action.tokenResponse; })];
            });
        });
    };
    IonicAuth.prototype.authObservableEvents = function (action) {
        switch (action.action) {
            case auth_action_1.AuthActions.Default:
                break;
            case auth_action_1.AuthActions.SignInSuccess:
            case auth_action_1.AuthActions.AutoSignInSuccess:
                this.onSignInSuccessful(action);
                break;
            case auth_action_1.AuthActions.RefreshSuccess:
                this.onRefreshSuccessful(action);
                break;
            case auth_action_1.AuthActions.SignOutSuccess:
                this.onSignOutSuccessful(action);
                break;
            case auth_action_1.AuthActions.SignInFailed:
            case auth_action_1.AuthActions.AutoSignInFailed:
                this.onSignInFailure(action);
                break;
            case auth_action_1.AuthActions.RefreshFailed:
                this.onRefreshFailure(action);
                break;
            case auth_action_1.AuthActions.SignOutFailed:
                this.onSignOutFailure(action);
                break;
        }
        return action;
    };
    //Auth Events To Be Overriden
    IonicAuth.prototype.onSignInSuccessful = function (action) {
    };
    IonicAuth.prototype.onSignOutSuccessful = function (action) {
    };
    IonicAuth.prototype.onRefreshSuccessful = function (action) {
    };
    IonicAuth.prototype.onSignInFailure = function (action) {
    };
    IonicAuth.prototype.onSignOutFailure = function (action) {
    };
    IonicAuth.prototype.onRefreshFailure = function (action) {
    };
    return IonicAuth;
}());
exports.IonicAuth = IonicAuth;
