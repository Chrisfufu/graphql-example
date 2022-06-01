import React, { useContext, useEffect } from "react";
import { useQuery, gql, useSubscription } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
	const { user } = useContext(AuthContext);
	const { loading, data: { getPosts: posts } = {}, err } = useQuery(
		FETCH_POSTS_QUERY
	);

	const { newPostData, loadingNewPost, newPostError } = useSubscription(
		NEW_POST,
		{
			onSubscriptionData: (data) => {
				console.log("onSubscriptionData", data);
			},
		}
	);

	// useEffect(()=>{
	// 	console.log('new post:: ', newPostData);
	// }, [newPostData])
	console.log("new post:: ", newPostData, loadingNewPost, newPostError);

	console.log("data", posts, err);
	return (
		<Grid columns={3}>
			<Grid.Row className="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}
				{loading ? (
					<h1>Loading posts..</h1>
				) : (
					posts &&
					posts.map((post) => (
						<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
							<PostCard post={post} />
						</Grid.Column>
						// <h1>{post.body}</h1>
					))
				)}
			</Grid.Row>
		</Grid>
	);
}
const NEW_POST = gql`
	subscription {
		newPost {
			body
		}
	}
`;

export default Home;
