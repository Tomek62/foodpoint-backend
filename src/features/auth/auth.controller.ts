// auth.controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";
import { SignUpRequest, SignInRequest } from "./user.model";


const authService = new AuthService();

export class AuthController {
  async signUp(
    request: FastifyRequest<{ Body: SignUpRequest }>,
    reply: FastifyReply
  ) {
    const { name, email, password } = request.body;

    try {
      const user = await authService.signUp(name, email, password);
      reply.status(201).send(user);
    } catch (error) {
        const message = (error as Error).message || "Une erreur est survenue";
        reply.status(400).send({ message });
    }
  }

  async googleLogin(
    request: FastifyRequest<{ Body: { token: string } }>,
    reply: FastifyReply
  ) {
    const { token } = request.body;

    try {
      const user = await authService.signUpWithGoogle(token);
      reply.send(user);
    } catch (error) {
      const message = (error as Error).message || "Une erreur est survenue";
      reply.status(400).send({ message });
    }
  }

  async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
    const { code } = request.query as { code: string };

    if (!code) {
      return reply.status(400).send({ error: "Code de vérification manquant" });
    }

    try {
      const user = await authService.verifyEmail(code);
      reply.send(user);
    } catch (error) {
      const message = (error as Error).message || "Une erreur est survenue";
      reply.status(400).send({ message });
    }
  }

  async signIn(
    request: FastifyRequest<{ Body: SignInRequest }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;

    try {
      const user = await authService.signIn(email, password);
      reply.send(user);
    } catch (error) {
      const message = (error as Error).message || "Une erreur est survenue";
      reply.status(400).send({ message });
    }
  }
}
