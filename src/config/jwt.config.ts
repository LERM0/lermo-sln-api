import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
  passphrase: process.env.JWT_PASSPHRASE,
  issuer: process.env.JWT_ISSUER,
  expiresIn: process.env.JWT_EXPIRESIN,
  privateKey: process.env.JWT_PRIVATE_KEY,
  publicKey: process.env.JWT_PUBLIC_KEY,
  algorithm: 'RS256',
}));