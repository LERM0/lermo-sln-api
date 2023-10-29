import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
  passphrase: process.env.JWT_PASSPHRASE,
  issuer: process.env.JWT_ISSUER,
  expiresIn: process.env.JWT_EXPIRESIN,
  privateKey: Buffer.from(process.env.JWT_PRIVATE_KEY, 'base64').toString('ascii'),
  publicKey: Buffer.from(process.env.JWT_PUBLIC_KEY, 'base64').toString('ascii'),
}));