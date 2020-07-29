import { TokenResponse } from '@openid/appauth';
export declare enum AuthActions {
    Default = "Default",
    SignInSuccess = "Sign In Success",
    SignInFailed = "Sign In Failed",
    SignOutSuccess = "Sign Out Success",
    SignOutFailed = "Sign Out Failed",
    RefreshSuccess = "Refresh Success",
    RefreshFailed = "Refesh Failed",
    AutoSignInFailed = "Auto Sign In Failed",
    AutoSignInSuccess = "Auto Sign In Success"
}
export interface IAuthAction {
    action: string;
    tokenResponse?: TokenResponse;
    error?: string;
}
export declare class AuthActionBuilder {
    static Default(): IAuthAction;
    static SignOutSuccess(): IAuthAction;
    static SignOutFailed(error: any): IAuthAction;
    static RefreshSuccess(token: TokenResponse): IAuthAction;
    static RefreshFailed(error: any): IAuthAction;
    static SignInSuccess(token: TokenResponse): IAuthAction;
    static SignInFailed(error: any): IAuthAction;
    static AutoSignInSuccess(token: TokenResponse): IAuthAction;
    static AutoSignInFailed(error: any): IAuthAction;
}
