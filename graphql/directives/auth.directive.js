// import apolloServerExpress from 'apollo-server-express';
// const { ApolloError, SchemaDirectiveVisitor } = apolloServerExpress;

import graphql from "graphql";
import { getDirective } from "@graphql-tools/utils";
// import {
// 	defaultFieldResolver
// } from "graphql";
export function isAuthDirective(field, directiveName, schema) {
	// console.log('field::', field);
	const isAuthCustom = getDirective(schema, field, directiveName)?.[0];
	
	if (isAuthCustom){
		const { resolve = defaultFieldResolver } = field;
		field.resolve = async function (...args) {
			let [_, {}, e] = args;
			let [a, b, c, d] = args;
			// let { isAuth } = c
			// console.log('isAuth::', e);
			if (e.isAuth) {
				const result = await resolve.apply(this, args);
				return result;
			} else {
				console.error("You must be the authenticated user to get this information");
			}
		};
	}
	
}
