export interface IEncryption {
  encrypt(password: string): string | void;
  decrypt(encryptedPassword: string): string;
}
