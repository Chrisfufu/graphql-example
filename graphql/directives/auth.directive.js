import { getDirective } from "@graphql-tools/utils";
// import {
// 	defaultFieldResolver
// } from "graphql";
import { ApolloError } from "apollo-server-express";

export function isAuthDirective(field, directiveName, schema) {
	// console.log('field::', field);
	const isAuthCustom = getDirective(schema, field, directiveName)?.[0];

	if (isAuthCustom) {
		const { resolve = defaultFieldResolver } = field;
		field.resolve = async function (...args) {
			let [_, {}, { isAuth }] = args;
			// let { isAuth } = c
			// console.log('isAuth::', e);
			if (isAuth) {
				const result = await resolve.apply(this, args);
				return result;
			} else {
				console.error("You must be the authenticated user to get this information");
				throw new ApolloError(
					"You must be the authenticated user to get this information"
				);
			}
		};
	}
}
