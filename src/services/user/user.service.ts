import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { Config } from 'src/configs';

export abstract class IUserService {
    abstract generateGoogleAuthUrl(): Promise<string>;
    abstract loginWithGoogle(code: string): Promise<void>;
}

export default class UserService implements IUserService {
    private googleOAuth: OAuth2Client;
    private config: Config;
    constructor(googleOAuth: OAuth2Client, config: Config) {
        this.googleOAuth = googleOAuth;
        this.config = config;
    }

    async generateGoogleAuthUrl(): Promise<string> {
        return this.googleOAuth.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile',
            redirect_uri: this.config.Google.RedirectUrl,
        });
    }

    async loginWithGoogle(code: string) {
        const { tokens } = await this.googleOAuth.getToken(code);
        const tokenInfo = await this.googleOAuth.getTokenInfo(tokens.access_token!);

        this.googleOAuth.setCredentials(tokens);
        const oauth2 = google.oauth2({
            auth: this.googleOAuth,
            version: 'v2',
        });
        const { data } = await oauth2.userinfo.get();
        console.log('tokens', tokens);
        console.log('tokenInfo', tokenInfo);
        console.log('data', data);
    }
}
