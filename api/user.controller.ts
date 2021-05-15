import _ from "lodash";
import { signJwt } from "../shared/jwt";
import fs from "fs";
import path from "path";
import * as PasswordHelper from "../shared/password";
import { UserInputError } from 'apollo-server-express';
import * as utils from "../shared/utils";
import { rule , shield , allow }  from "graphql-shield";
import { isAuthorized } from "../shared/shield";
import {
    AuthenticationTicket,
    ContextType,
    ForgotPasswordInput,
    LoginInput, LoginResponse,
    ResetPasswordInput,
    SignUpInputs
} from "../shared/types";
import {User} from "../models/User";

export default {
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

            user: async (obj,args,{ user } : ContextType, info ) => {
                return await User.findByPk(user.id);
            }

        },

        Mutation: {

            login: async (obj,{ username , password } : LoginInput , context, info ) => {

                const result : LoginResponse = { status: null , ticket: null  };
                const user = await User.findOne({ where: { username } });
                if(_.isNil(user) || !PasswordHelper.areEqual(user.password_hash,user.password_salt,password))
                    result.status = "invalid_credentials";
                else{
                    result.status = 'success';
                    result.ticket = {
                        accessToken: signJwt(user),
                        user
                    };
                }

                return result;
            },

            signUp: async (obj,{ input } : { input: SignUpInputs },context : ContextType,info) => {

                //  check username already exists
                if(await User.findOne({ where: { username: input.username } }))throw new UserInputError('Username already used!');

                //  check phone number already exists
                if(!_.isNil(input.phone) && await User.findOne({ where: { phone: input.phone } }))throw new UserInputError('Phone number already exists');

                //  check email already exists
                if(!_.isNil(input.email) && await User.findOne({ where: { email: input.email } }))throw new UserInputError('Email already exists');

                const pwdSalt = PasswordHelper.generateSalt();
                const user =  await User.create({
                    ..._.pick(input,['username','name','email','phone']),
                    password_hash: PasswordHelper.hashPassword(input.password,pwdSalt),
                    password_salt: pwdSalt
                });

                return  { accessToken: signJwt(user), user } as AuthenticationTicket;
            },

            forgotPassword: async(obj, { username } : ForgotPasswordInput , context : ContextType , info) => {

                const user = await User.findOne({ where: { username }});

                if(_.isNil(user))throw new UserInputError('No account associated with username')

                user.password_reset_code = utils.generatePasswordCode();

                await user.save();

                return {
                    id: user.id,
                    token: user.password_reset_code
                };
            },

            resetPassword: async (obj, { code, newPassword , confirmPassword , id } : ResetPasswordInput, context : ContextType, info) => {

                const user = await User.findByPk(id);
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
