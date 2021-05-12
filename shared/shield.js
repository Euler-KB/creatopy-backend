const { rule } = require("graphql-shield");
const _ = require("lodash");

exports.isAuthorized = rule()(
    (obj, args, { user }, info) => !_.isNil(user)
);
