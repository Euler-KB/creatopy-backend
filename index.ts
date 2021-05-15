require("dotenv").config();
import {ContextType} from "./shared/types";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { verifyJwt } from "./shared/jwt";
import { getSchema } from "./api";
import _ from "lodash";
import * as DB from "./database";

const PORT : string | number  = process.env.PORT || 2000;

async function main() {

    const schema = getSchema();
    const app = express();

    app.use(cors());

    //  export application object
    exports.app = app;

    const server = new ApolloServer({
        context: ({ req, res })=> {

            const context : ContextType = { };
            if(!_.isNil(req.headers['authorization']) && req.headers['authorization'].startsWith("Bearer")){
                const auth = req.headers['authorization'].split(' ');
                if(auth.length === 2){
                    const [,token] = auth;
                    const payload = verifyJwt(token);
                    if(!_.isNil(payload))
                        context.user = payload;
                }
            }

            return context;
        },
        schema,
        debug: true
    });

    server.applyMiddleware({ app });

    //  initialize database
    await DB.initialize();

    //  start server
    app.listen(PORT, () => {
        console.log(`Server started successfully on port: ${PORT}`);
    });


}

//  run server
main();
