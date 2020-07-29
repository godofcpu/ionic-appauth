"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthActions;
(function (AuthActions) {
    AuthActions["Default"] = "Default";
    AuthActions["SignInSuccess"] = "Sign In Success";
    AuthActions["SignInFailed"] = "Sign In Failed";
    AuthActions["SignOutSuccess"] = "Sign Out Success";
    AuthActions["SignOutFailed"] = "Sign Out Failed";
    AuthActions["RefreshSuccess"] = "Refresh Success";
    AuthActions["RefreshFailed"] = "Refesh Failed";
    AuthActions["AutoSignInFailed"] = "Auto Sign In Failed";
    AuthActions["AutoSignInSuccess"] = "Auto Sign In Success";
})(AuthActions = exports.AuthActions || (exports.AuthActions = {}));
var AuthActionBuilder = /** @class */ (function () {
    function AuthActionBuilder() {
    }
    AuthActionBuilder.Default = function () {
        return {
            action: AuthActions.Default,
        };
    };
    AuthActionBuilder.SignOutSuccess = function () {
        return {
            action: AuthActions.SignOutSuccess,
        };
    };
    AuthActionBuilder.SignOutFailed = function (error) {
        return {
            action: AuthActions.SignOutFailed,
            error: JSON.stringify(error)
        };
    };
    AuthActionBuilder.RefreshSuccess = function (token) {
        return {
            action: AuthActions.RefreshSuccess,
            tokenResponse: token
        };
    };
    AuthActionBuilder.RefreshFailed = function (error) {
        return {
            action: AuthActions.RefreshFailed,
            error: JSON.stringify(error)
        };
    };
    AuthActionBuilder.SignInSuccess = function (token) {
        return {
            action: AuthActions.SignInSuccess,
            tokenResponse: token
        };
    };
    AuthActionBuilder.SignInFailed = function (error) {
        return {
            action: AuthActions.AutoSignInFailed,
            error: JSON.stringify(error)
        };
    };
    AuthActionBuilder.AutoSignInSuccess = function (token) {
        return {
            action: AuthActions.AutoSignInSuccess,
            tokenResponse: token
        };
    };
    AuthActionBuilder.AutoSignInFailed = function (error) {
        return {
            action: AuthActions.AutoSignInFailed,
            error: JSON.stringify(error)
        };
    };
    return AuthActionBuilder;
}());
exports.AuthActionBuilder = AuthActionBuilder;
