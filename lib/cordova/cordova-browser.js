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
var index_1 = require("./index");
var auth_browser_1 = require("../auth-browser");
var safari_view_controller_1 = require("@ionic-native/safari-view-controller");
var in_app_browser_1 = require("@ionic-native/in-app-browser");
// REQUIRES CORDOVA PLUGINS
// cordova-plugin-safariviewcontroller
// cordova-plugin-customurlscheme
// cordova-plugin-inappbrowser FROM https://github.com/Onegini/cordova-plugin-inappbrowser.git
var CordovaBrowser = /** @class */ (function (_super) {
    __extends(CordovaBrowser, _super);
    function CordovaBrowser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CordovaBrowser.prototype.closeWindow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, index_1.CordovaDocument.ready()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, safari_view_controller_1.SafariViewController.isAvailable()];
                    case 2:
                        if (_a.sent()) {
                            safari_view_controller_1.SafariViewController.hide();
                        }
                        else {
                            if (this.inAppBrowserRef != undefined)
                                this.inAppBrowserRef.close();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CordovaBrowser.prototype.showWindow = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var optionSafari, options;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, index_1.CordovaDocument.ready()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, safari_view_controller_1.SafariViewController.isAvailable()];
                    case 2:
                        if (_a.sent()) {
                            optionSafari = {
                                url: url,
                                showDefaultShareMenuItem: false,
                                toolbarColor: '#ffffff'
                            };
                            safari_view_controller_1.SafariViewController.show(optionSafari).subscribe(function (result) {
                                if (result.event === 'closed') {
                                    _this.onCloseFunction();
                                }
                            });
                        }
                        else {
                            options = {
                                location: 'no',
                                zoom: 'no',
                                clearcache: 'yes',
                                clearsessioncache: 'yes',
                            };
                            this.inAppBrowserRef = in_app_browser_1.InAppBrowser.create(url, '_self', options);
                            if (this.inAppBrowserRef != undefined)
                                this.inAppBrowserRef.on('exit').subscribe(function (event) { return _this.onCloseFunction; });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return CordovaBrowser;
}(auth_browser_1.Browser));
exports.CordovaBrowser = CordovaBrowser;
