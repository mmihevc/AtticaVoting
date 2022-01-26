import fs from "fs";
import path from "path";

import { gql } from "apollo-server-express";

import {resolveType} from './ElectionItem/*'
import * as mutation from './Mutation'
import * as query from './Query'

const schema = [fs.readFileSync(path.join(__dirname, "../schema.graphql"), "utf8")];
const typeDefs = gql(schema);

const resolvers = {
    Query: query,
    Mutation: mutation,
}

export {typeDefs, resolvers}