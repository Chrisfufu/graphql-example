import { defaultFieldResolver } from "graphql";

// import apolloServerExpress from 'apollo-server-express';
// const { ApolloError, SchemaDirectiveVisitor } = apolloServerExpress;

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
