import { gql } from "apollo-server-express";

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
		images: [PostFile]
	}
	type PostFile {
		id:ID!
		imageLink: String
	}
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
	scalar Upload

	type File {
		filename: String!
		mimetype: String!
		encoding: String!
	}
	input imageInput {
		imageLink: String
	}
	extend type Query {
		getPosts: [Post] @isAuth
		getPost(postId: ID!): Post @isAuth
		getPostsByUserId(userId: ID!): [Post] @isAuth
	}
	extend type Mutation {
		createPost(body: String!, imagePaths: [imageInput]): Post! @isAuth
		deletePost(postId: ID!): String! @isAuth
		createComment(postId: String!, body: String!): Comment! @isAuth
		deleteComment(postId: ID!, commentId: ID!): Post! @isAuth
		likePost(postId: ID!): Post! @isAuth
	}
	extend type Subscription {
		newPost: Post!
	}
`;
