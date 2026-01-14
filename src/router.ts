import fastify from "fastify"
import { OAuth2Client } from "google-auth-library";
import UserController from "./controllers/user/user.controller";
import UserService from "./services/user/user.service";
import config from "./configs";

const server = fastify()

const googleOAuth = new OAuth2Client(
    config.Google.ClientId,
    config.Google.ClientSecret,
    config.Google.RedirectUrl
);

const userService = new UserService(googleOAuth, config);
const userController = new UserController(userService, googleOAuth);

server.get('/api/v1/google-auth/url', userController.generateGoogleAuthUrl.bind(userController))
server.get('/api/v1/google-auth/callback', userController.handleGoogleAuthCallback.bind(userController))

export default server