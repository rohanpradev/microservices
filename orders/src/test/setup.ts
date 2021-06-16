import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

let mongo: any;

jest.mock('../utils/nats-wrapper.ts');

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  process.env.NODE_ENV = 'test';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

global.signin = () => {
  //  Build a JWT  payload. { id, email }
  const payload = { id: randomBytes(9).toString('hex'), email: `${randomBytes(9)}@test.com` };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build the session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const encoded = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${encoded}`];
};
