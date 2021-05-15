import {FindOptions} from "sequelize";
import {Item} from "../models/Item";

import _ from "lodash";
import fs from "fs";
import path from "path";
import { isAuthorized } from "../shared/shield";
import {ContextType} from "../shared/types";

export default {
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

            itemById: async (obj, { id } , { user } : ContextType,info ) => {

                const options : FindOptions = {
                    where: {
                        id,
                        user_id: user.id
                    }
                };

                return await Item.findOne(options);
            },

            items: async (obj,{ page , limit },{ user }: ContextType,info) => {
                const options : FindOptions = { where: {  user_id: user.id } };
                if(!_.isNil(page))options.offset = (page - 1) * limit;
                if(!_.isNil(limit))options.limit = limit;
                return await Item.findAll(options);
            }

        },

        Mutation: {

            createItem: async (obj,{ input },{ user } : ContextType ,info) => {

                return await Item.create({
                    title: input.title,
                    user_id: user.id
                });

            },

            removeItem: async (obj, { id },context : ContextType, info) => {
                return await Item.destroy({ where: { id } }) > 0;
            }
        }
    }
}
