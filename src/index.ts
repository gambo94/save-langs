import fastify from 'fastify';
import autoload from '@fastify/autoload';

import path from 'path';

import mongoose from 'mongoose';
import { initModels } from './models/init';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Fastify setup
const app = fastify({
  logger: true,
  ignoreTrailingSlash: true, // Ensures that routes without trailing slashes are handled correctly
});

// Register CORS, Helmet, and Sensible
app
  .register(require('@fastify/cors'), {})
  .register(require('@fastify/helmet'))
  .register(require('@fastify/sensible'))

const startServer = async () => {
  try {
    // Connect to MongoDB using the connection string in the .env file
    mongoose.set('strictQuery', true);
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
      }
    console.info(process.env.MONGODB_URI, '==> MongoDB URL');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fanes', { autoIndex: false });
    console.info('\n==> Connected to MongoDB.\n');

    // Initialize models
    initModels();

    // Register API routes using autoload
    app.register(autoload, {
      dir: path.join(__dirname, 'api'), // Directory where route files are stored
      options: {
        prefix: '/api-v1',
      },
      matchFilter: (path: string) => path.endsWith('.routes.ts'),
    });

    // Set default port or use environment variable
    const PORT = Number(process.env.PORT) || 3000;

    // Start the Fastify server
    await app.listen({ port: PORT, host: '0.0.0.0' });

    // Development logging: print routes
    if (process.env.NODE_ENV === 'development') {
      app.log.info('\n' + app.printRoutes({ commonPrefix: false }))
    }

    // Log server details
    const address = app.server.address();
    const port = address && typeof address !== 'string' ? address.port : 'unknown';
    console.info(
      '\n===========================================================================' +
      `\nSave Langs API ready / Port: ${port} / NODE_ENV: ${process.env.NODE_ENV} / Fastify ver ${app.version}` +
      '\n===========================================================================',
    )
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Start the server
startServer();
