import { FastifyReply, FastifyRequest } from "fastify";
import { OAuth2Client } from "google-auth-library";

export default class Controller {
    private readonly googleOAuth: OAuth2Client;
    constructor(googleOAuth: OAuth2Client) { this.googleOAuth = googleOAuth }

    async useAuthorization(req: FastifyRequest, res: FastifyReply) {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        try {
            await this.googleOAuth.getTokenInfo(token);
        } catch (err) {

        }
        
    }
}