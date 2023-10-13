import { registerAs } from "@nestjs/config";

export default registerAs('db', () => ({
  url: process.env.DATABASE_CONNECTION || 'mongodb://username:password@0.0.0.0:27017',
}));