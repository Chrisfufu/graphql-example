// import { IsAuthDirective } from "./auth.directive.js";
import typeDefs from "../typeDefs/index.js";
import resolvers from "../resolvers/index.js";

// import * as  graphqlToolSchema from "@graphql-tools/schema";
// import graphqlToolSchema from "apollo-server-express";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
// import graphql from "graphql";
// const { defaultFieldResolver } = graphql;
// const { mapSchema, getDirective, MapperKind } = graphqlToolsUtils;
// const { makeExecutableSchema } = graphqlToolSchema;
import { makeExecutableSchema } from '@graphql-tools/schema'
// // const schemaDirectives = {
// // 	isAuth: IsAuthDirective,
// // };
// const { makeExecutableSchema } = graphqlTools;

function upperDirectiveTransformer(fieldConfig, directiveName, schema) {
	const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
	if (upperDirective) {
		// Get this field's original resolver
		const { resolve = defaultFieldResolver } = fieldConfig;

		// Replace the original resolver with a function that *first* calls
		// the original resolver, then converts its result to upper case
		fieldConfig.resolve = async function (source, args, context, info) {
			const result = await resolve(source, args, context, info);
			if (typeof result === "string") {
				return result.toUpperCase();
			}
			return result;
		};
		return fieldConfig;
	}
}
function upperCaseDirectiveTransformer(fieldConfig, directiveName, schema) {
	const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
	if (upperDirective) {
		// Get this field's original resolver
		const { resolve = defaultFieldResolver } = fieldConfig;

		// Replace the original resolver with a function that *first* calls
		// the original resolver, then converts its result to upper case
		fieldConfig.resolve = async function (source, args, context, info) {
			const result = await resolve(source, args, context, info);
			if (typeof result === "string") {
				return result.toUpperCase();
			}
			return result;
		};
		return fieldConfig;
	}
}

let schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});
// let schema = null;
schema = mapSchema(schema, {
	[MapperKind.OBJECT_FIELD]: (field) => {
		upperCaseDirectiveTransformer(field, "upperCase", schema);
		upperDirectiveTransformer(field, "upper", schema);
	},
});

export default schema;
