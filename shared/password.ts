import crypto from 'crypto';

export const generateSalt = (size = 32) : string => {
    return crypto.randomBytes(size).toString('base64');
}

export const hashPassword = (plainPassword: string, salt: string) : string => {
    const key = Buffer.from(salt, 'base64');
    return crypto.pbkdf2Sync(plainPassword,key,10000 ,key.length, 'SHA256' ).toString('base64');
};

export const areEqual = (hash: string,salt: string,plainPassword: string) : boolean => {
    return exports.hashPassword(plainPassword,salt) === hash;
};
