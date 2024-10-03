import crypto from 'crypto'
import { NewEncryptedRecipient, NewRecipient } from '../../@types/Recipient';


const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
const encryptionIv = Buffer.from(process.env.ENCRYPTION_IV!, 'hex');


// Encrypt function
export function encrypt(text: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey!, encryptionIv!);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
  
  // Decrypt function
export function decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey!, encryptionIv!);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

