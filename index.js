require('dotenv').config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const jwt = require("./shared/jwt");
const api = require("./api");
const _ = require("lodash");

const PORT = process.env.PORT || 2000;

function main() {

    const app = express();
    app.use(cors());

    const schema = api.getSchema();

    const server = new ApolloServer({
        context: ({ req, res })=> {

            const context = { };
            if(!_.isNil(req.headers['authorization']) && req.headers['authorization'].startsWith("Bearer")){
                const auth = req.headers['authorization'].split(' ');
                if(auth.length === 2){
                    const [,token] = auth;
                    const payload = jwt.verify(token);
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

    //  start server
    app.listen(PORT, () => {
        console.log(`Server started successfully on port: ${PORT}`);
    });

    return { app , server };
}

module.exports = main();
