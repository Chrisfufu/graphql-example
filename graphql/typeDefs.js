import { gql } from "apollo-server-express"

export default gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
		comments: [Comment]!
		likes: [Like]!
		likeCount: Int!
		commentCount: Int!
		user: User
	}
	# enum UserInfo {
	#   id
	#   email
	# }
	type Comment {
		id: ID!
		createdAt: String!
		username: String!
		body: String
	}
	type Like {
		id: ID!
		createdAt: String
		username: String!
	}
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
	scalar Upload

	type File {
		filename: String!
		mimetype: String!
		encoding: String!
	}
	type Query {
		getPosts: [Post]
		getUsers: [User]
		getPost(postId: ID!): Post
		getPostsByUserId(userId: ID!): [Post]
	}
	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		createPost(body: String!): Post!
		deletePost(postId: ID!): String!
		createComment(postId: String!, body: String!): Comment!
		deleteComment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post!
		singleUpload(file: Upload!): File!
	}
	# type Subscription {
	# 	newPost: Post!
	# }
`;
