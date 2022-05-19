import { isAuthDirective } from "./auth.directive.js";
import typeDefs from "../typeDefs/index.js";
import resolvers from "../resolvers/index.js";

import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

import { makeExecutableSchema } from '@graphql-tools/schema'


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
		isAuthDirective(field, "isAuth", schema)
	},
});

export default schema;
