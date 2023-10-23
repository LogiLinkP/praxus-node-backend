const crypto = require('crypto');

export function encrypt(text: any){
    const algorithm = process.env.ENCRYPT_ALGORITHM;
    const key = process.env.ENCRYPT_SECRET_KEY;
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    }
}