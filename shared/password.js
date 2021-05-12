const crypto = require("crypto");

exports.generateSalt = (size = 32) => {
    return crypto.randomBytes(size).toString('base64');
}

exports.hashPassword = (plainPassword, salt) => {
    const key = Buffer.from(salt, 'base64');
    return crypto.pbkdf2Sync(plainPassword,key,10000 ,key.length, 'SHA256' ).toString('base64');
};

exports.areEqual = (hash,salt,plainPassword) => {
    return exports.hashPassword(plainPassword,salt) === hash;
};
