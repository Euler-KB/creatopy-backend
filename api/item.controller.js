const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const DB = require("../models");
const { rule , shield , allow }  = require("graphql-shield");
const { isAuthorized } = require("../shared/shield");

module.exports = {
    typeDefs: fs.readFileSync( path.resolve(__dirname, 'item.api.graphql') , 'utf-8'),
    permissions: {
        Query: {
            itemById: isAuthorized,
            items: isAuthorized
        },
        Mutation: {
            createItem: isAuthorized,
            removeItem: isAuthorized
        }
    },
    resolvers: {

        Query: {

            itemById: async (obj, { id } , { user },info ) => {
                return await DB.Item.findByPk(id,{
                    where: {
                        user_id: user.id
                    }
                });
            },

            items: async (obj,{ page , limit },{ user },info) => {
                const options = { where: {  user_id: user.id } };
                if(!_.isNil(page))options.offset = (page - 1) * limit;
                if(!_.isNil(limit))options.limit = limit;
                return await DB.Item.findAll(options);
            }

        },

        Mutation: {

            createItem: async (obj,{ input },{ user },info) => {

                return await DB.Item.create({
                    title: input.title,
                    user_id: user.id
                });

            },

            removeItem: async (obj, { id },context, info) => {
                return await DB.Item.destroy({ where: { id } }) > 0;
            }
        }
    }
}
