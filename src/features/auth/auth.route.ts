// auth.route.ts
import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { auth } from 'firebase-admin';


export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController();

  app.post('/auth/signup', authController.signUp.bind(authController));
  app.post('/auth/google', authController.googleLogin.bind(authController));
  app.get('/auth/verify-email', authController.verifyEmail.bind(authController));
  app.post('/auth/signin', authController.signIn.bind(authController));
}