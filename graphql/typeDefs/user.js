import { gql } from "apollo-server-express"

export default gql`
	type User {
		id: ID!
		email: String
		token: String!
		username: String
		createdAt: String!
	}
	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}
	extend type Query {
		getUsers: [User]
		hello: String @upper
	}
	extend type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User
	}
	extend type Subscription {
		getMessage: String
	}
`;
