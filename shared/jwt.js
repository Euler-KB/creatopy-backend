const jwt = require("jsonwebtoken");

const JWT_KEY = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;

exports.sign = (user, options) => {
    return jwt.sign({ id: user.id },options?.key || JWT_KEY , {
        issuer: options?.issuer || JWT_ISSUER,
        algorithm: 'HS256'
    });
};

exports.verify = (token, options) => {

    try{
        const { id } = jwt.verify(token,options?.key || JWT_KEY,{
            issuer: options?.issuer || JWT_ISSUER
        });

        return { id };
    }
    catch (e) {
        console.error('Failed parsing or processing jwt',e);
    }
};
