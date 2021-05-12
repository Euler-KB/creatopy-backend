const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const DB = require("../models");
const PasswordHelper = require("../shared/password");
const jwt = require('../shared/jwt');
const { UserInputError } = require('apollo-server-express');
const utils = require("../shared/utils");
const { rule , shield , allow }  = require("graphql-shield");
const { isAuthorized } = require("../shared/shield");

module.exports = {
    typeDefs: fs.readFileSync( path.resolve(__dirname, 'user.api.graphql') , 'utf-8'),
    permissions: {
        Query: {
            user: isAuthorized
        },
        Mutation: {
            login: allow,
            signUp: allow,
            forgotPassword: allow,
            resetPassword: allow
        }
    },
    resolvers: {

        Query: {

            user: async (obj,args,{ user }, info ) => {
                return await DB.User.findByPk(user.id);
            }

        },

        Mutation: {

            login: async (obj,{ username , password } , context, info ) => {

                const result = { status: null , ticket: null  };
                const user = await DB.User.findOne({ where: { username } });
                if(_.isNil(user) || !PasswordHelper.areEqual(user.password_hash,user.password_salt,password))
                    result.status = "invalid_credentials";
                else{
                    result.status = 'success';
                    result.ticket = {
                        accessToken: jwt.sign(user),
                        user
                    };
                }

                return result;
            },

            signUp: async (obj,{ input },context,info) => {

                //  check username already exists
                if(await DB.User.findOne({ where: { username: input.username } }))throw new UserInputError('Username already used!');

                //  check phone number already exists
                if(!_.isNil(input.phone) && await DB.User.findOne({ where: { phone: input.phone } }))throw new UserInputError('Phone number already exists');

                //  check email already exists
                if(!_.isNil(input.email) && await DB.User.findOne({ where: { email: input.email } }))throw new UserInputError('Email already exists');

                const pwdSalt = PasswordHelper.generateSalt();
                const user =  await DB.User.create({
                    ..._.pick(input,['username','name','email','phone']),
                    password_hash: PasswordHelper.hashPassword(input.password,pwdSalt),
                    password_salt: pwdSalt
                });

                return  {
                    accessToken: jwt.sign(user),
                    user
                };
            },

            forgotPassword: async(obj, { username } , context , info) => {

                const user = await DB.User.findOne({ where: { username }});

                if(_.isNil(user))throw new UserInputError('No account associated with username')

                user.password_reset_code = utils.generatePasswordCode();

                await user.save();

                return {
                    id: user.id,
                    token: user.password_reset_code
                };
            },

            resetPassword: async (obj, { code, newPassword , confirmPassword , id }, context, info) => {

                const user = await DB.User.findByPk(id);
                if(confirmPassword !== newPassword) throw new UserInputError("Passwords do not match");
                if(code !== user.password_reset_code)throw new UserInputError("Invalid password reset code")

                const salt = PasswordHelper.generateSalt();
                user.password_salt = salt;
                user.password_hash = PasswordHelper.hashPassword(newPassword , salt);

                await user.save();

                return true;
            }
        }
    }
}
