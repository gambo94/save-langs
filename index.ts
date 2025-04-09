// index.ts
import fastify from 'fastify';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Fastify setup
const app = fastify({
  logger: true,
  ignoreTrailingSlash: true, // Ensures that routes without trailing slashes are handled correctly
});

// MongoDB connection
const startServer = async () => {
  try {
    // Connect to MongoDB using the connection string in the .env file
    mongoose.set('strictQuery', true);
    console.info(process.env.MONGODB_URL, '==> MongoDB URL');
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/fanes', { autoIndex: false });
    console.info('\n==> Connected to MongoDB.\n');

    // Fastify routes
    app.get('/', async (request, reply) => {
      reply.send({ message: 'Hello from the Save Langs API!' });
    });

    // Start Fastify server
    await app.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.info(`Server is running at http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Start the server
startServer();
