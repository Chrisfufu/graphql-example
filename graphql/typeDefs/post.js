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
	extend type Query {
		getPosts: [Post] @isAuth
		getPost(postId: ID!): Post
		getPostsByUserId(userId: ID!): [Post]
	}
	extend type Mutation {
		createPost(body: String!): Post! @isAuth
		deletePost(postId: ID!): String! @isAuth
		createComment(postId: String!, body: String!): Comment! @isAuth
		deleteComment(postId: ID!, commentId: ID!): Post! @isAuth
		likePost(postId: ID!): Post! @isAuth
	}
	extend type Subscription {
		newPost: Post!
	}
`;
