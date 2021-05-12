const fs = require("fs");
const path=  require("path");
const _ = require("lodash");
const GraphQLDateTime = require('graphql-type-datetime');

const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("graphql-tools");
const { allow, shield } = require('graphql-shield');

/**
 * Load controller
 * @param name
 * @returns {any}
 */
const discoverSource = name => {
    return require(`./${name}`);
};

/**
 * Get schema
 * @returns {Promise<{}>}
 */
exports.getSchema = () => {

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
