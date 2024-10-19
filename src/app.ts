import fastify from "fastify";
import { FastifyRequest, FastifyReply } from "fastify";
import dotenv from "dotenv";
import { authRoutes } from "./features/auth/auth.route";
import fastifyCors from '@fastify/cors';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
dotenv.config();

const app = fastify();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string; // Replace with your Supabase URL
const supabaseKey = process.env.SUPABASE_KEY as string; // Replace with your public API key
const supabase = createClient(supabaseUrl, supabaseKey);

// Define routes
app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ hello: "world" });
});

// CORS configuration
app.register(fastifyCors, {
  origin: 'http://localhost:3000', // Replace with the URL of your frontend
  methods: ['POST', 'GET'],
});

// Register auth routes
app.register(authRoutes);

// Start the server
app.listen({ port: 3001 }, (err: Error | null) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Server is running on http://localhost:3001");
});
