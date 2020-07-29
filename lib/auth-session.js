"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultAuthSession = /** @class */ (function () {
    function DefaultAuthSession() {
        this.isAuthenticated = false;
        this.token = undefined;
        this.user = undefined;
    }
    return DefaultAuthSession;
}());
exports.DefaultAuthSession = DefaultAuthSession;
