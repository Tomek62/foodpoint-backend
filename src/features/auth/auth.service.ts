import * as admin from "firebase-admin";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { hash,compare } from "bcryptjs";
import { sendVerificationEmail } from "../emails/email.service";



const prisma = new PrismaClient();

export class AuthService {
  private oauth2Client: OAuth2Client;

  constructor() {
    // Initialize OAuth2Client with Google credentials (clientId and clientSecret)
    this.oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async signUp(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    // Générer un code de vérification aléatoire
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    try {
      // Send verification email
      await sendVerificationEmail(email, verificationCode);
      console.log('Verification email sent');
    } catch (error) {
      console.error('Error sending verification email:', error); // Log email sending errors
    }

    return { message: "User registered successfully", user };
  }
  async signUpWithGoogle(token: string) {
    // Verify the token received from Google
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid Google token");
    }

    const { email, name, sub: googleId } = payload;

    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
        },
      });
    }

    // Return the user
    return { user, message: "User logged in successfully via Google" };
  }

  
  async signIn(email: string, password: string) {
    // 1. Vérifier si l'utilisateur existe dans la base de données
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
  
    // 2. Comparer le mot de passe en clair avec le mot de passe haché en base de données
    if (!user.password) {
      throw new Error("Password is missing for the user");
    }
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect");
    }
  
    // 3. Vérifier si l'adresse e-mail a été vérifiée (si tu as mis en place une vérification d'email)
    if (!user.emailVerified) {
      throw new Error("Veuillez vérifier votre adresse e-mail avant de vous connecter");
    }
  
    // 4. Si tout est valide, tu peux créer un token JWT ou gérer la session
    // const token = createJWT(user); // Tu devrais avoir une fonction qui gère les JWT
  
    return {
      message: "Connexion réussie",
      user,
      // token, // Optionnel si tu utilises des JWT
    };
  }

  async verifyEmail(code:string) {
      // Vérifier si le code de vérification existe et est valide
      const user = await prisma.user.findFirst({
        where: {
          verificationCode: code,
          emailVerified: false, // Assurez-vous que l'utilisateur n'a pas encore vérifié son e-mail
        },
      });

      if (!user) {
        throw new Error("Invalid verification code");
      }

      // Si le code est valide, mettre à jour le statut de l'utilisateur pour indiquer que son e-mail a été vérifié
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationCode: null, // Effacer le code après vérification
        },
      });

      // Envoyer un message de confirmation de vérification
      return { message: 'Email successfully verified' };
    } 
}
