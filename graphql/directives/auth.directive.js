// import apolloServerExpress from 'apollo-server-express';
// const { ApolloError, SchemaDirectiveVisitor } = apolloServerExpress;

import graphqlToolsUtils from "@graphql-tools/utils";
import graphql from "graphql";
const { defaultFieldResolver } = graphql;
const { mapSchema, getDirective, MapperKind } = graphqlToolsUtils;
// export class IsAuthDirective extends SchemaDirectiveVisitor {
// 	visitFieldDefinition(field) {
// 		const { resolve = defaultFieldResolver } = field;
// 		field.resolve = async function (...args) {
// 			let [_, {}, { user, isAuth }] = args;
// 			if (isAuth) {
// 				const result = await resolve.apply(this, args);
// 				return result;
// 			} else {
// 				console.error("You must be the authenticated user to get this information");
// 			}
// 		};
// 	}
// }

export function IsAuthDirective(field, directiveName, schema) {
	const { resolve = defaultFieldResolver } = field;
	field.resolve = async function (...args) {
		console.log('args', args);
		let [_, {}, { user, isAuth }] = args;
		if (isAuth) {
			const result = await resolve.apply(this, args);
			return result;
		} else {
			console.error("You must be the authenticated user to get this information");
		}
	};
}
