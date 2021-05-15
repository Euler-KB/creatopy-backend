import { rule } from "graphql-shield";
import _ from "lodash";

export const isAuthorized = rule()(
    (obj, args, { user }, info) => !_.isNil(user)
);
