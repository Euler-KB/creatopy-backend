import fs from "fs";
import path from "path";
import _ from "lodash";
import GraphQLDateTime from 'graphql-type-datetime';
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";
import { allow, shield } from 'graphql-shield';

/**
 * Load controller
 * @param name
 * @returns {any}
 */
const discoverSource = name => {
    return require(`./${name}`).default;
};

/**
 * Get schema
 * @returns {Promise<{}>}
 */
export const getSchema = () => {

    const sources = [

        'item.controller',
        'user.controller',

        // TODO: Place additional controllers here

    ].map(x => discoverSource(x));

    const schema = makeExecutableSchema({
        typeDefs: [ fs.readFileSync(path.resolve(__dirname,'root.api.graphql'), 'utf-8') ].concat( sources.map(x => x.typeDefs) ),
        resolvers: [{
            DateTime: GraphQLDateTime
        }].concat( sources.map(x => x.resolvers) )
    });

    const permissions = sources.reduce((a,b) => _.merge(a.permissions,b.permissions));
    return applyMiddleware(schema, shield (permissions,{
        fallbackRule: allow,
        allowExternalErrors: true
    }) );
};
