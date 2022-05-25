import { gql } from "apollo-server-express"

export default gql`
	scalar Upload

	type File {
		filename: String!
		mimetype: String!
		encoding: String!
		serverFile: String!
	}
	extend type Mutation {
		singleUpload(file: Upload!): File! @isAuth
	}
`;
