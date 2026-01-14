import { FastifyReply, FastifyRequest } from "fastify";
import Controller from "../../core/controller";
import { IUserService } from "../../services/user/user.service";
import { OAuth2Client } from "google-auth-library";

export default class UserController extends Controller {
    private readonly userService: IUserService;
    constructor(userService: IUserService, googleOAuth: OAuth2Client) {
        super(googleOAuth);
        this.userService = userService;
    }

    async generateGoogleAuthUrl(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const url = await this.userService.generateGoogleAuthUrl();
        res.status(200).send({ url });
    }

    async handleGoogleAuthCallback(req: FastifyRequest<{ Querystring: { code: string } }>, res: FastifyReply): Promise<void> {
        const code = req.query.code;
        if (!code) {
            res.status(400).send({ error: 'Code is required' });
            return;
        }
        console.log('code', code);
        await this.userService.loginWithGoogle(code);
        console.log('done');
        res.status(204)
    }
}