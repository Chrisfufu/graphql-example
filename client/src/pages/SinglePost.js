import React, { useContext, useState, useRef, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import moment from "moment";
import {
	Button,
	Card,
	Form,
	Grid,
	Image,
	Icon,
	Label,
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../util/MyPopup";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function SinglePost(props) {
	const postId = props.match.params.postId;
	const history = useHistory();
	const { user } = useContext(AuthContext);
	const commentInputRef = useRef(null);

	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	const [post, setPost] = useState({});
	const [errMessage, setErrMessage] = useState("");

	const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});
	useEffect(() => {
		if (!user) {
			history.push("/home");
		}
	}, []);

	useEffect(() => {
		if (data?.getPost && JSON.stringify(data.getPost) !== JSON.stringify(post)) {
			console.log("I am here again ", comments, data.getPost);
			setPost(data.getPost);
			setComments(data.getPost.comments);
		}
		if (error?.message) {
			setErrMessage(error.message);
		}
	}, [data, error]);

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		onCompleted(data) {
			setComment("");
		},
		onError: (err) => {
			console.error("Err", err);
		},
		// the following refetch queries could also work, it's just another network call
		// using update() method could aviod another network call.
		// refetchQueries: [
		// 	{
		// 		query: FETCH_POST_QUERY, // DocumentNode object parsed with gql
		// 		variables: {
		// 			postId,
		// 		},
		// 	},
		// ],
		update(cache, { data: { createComment } }) {
			const data = cache.readQuery({
				query: FETCH_POST_QUERY,
				variables: {
					postId,
				},
			});
			// deep copy of the data
			let post = JSON.parse(JSON.stringify(data.getPost));
			post.comments = [...post.comments, createComment];
			cache.writeQuery({
				query: FETCH_POST_QUERY,
				variables: {
					postId,
				},
				data: {
					getPost: post,
				},
			});
			const posts = cache.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			// sometimes the cache does not have it. so having a condition here
			if (posts) {
				let allPosts = JSON.parse(JSON.stringify(posts.getPosts));
				let updatedPostIndex = allPosts.findIndex((post) => post.id === postId);
				allPosts[updatedPostIndex].commentCount += 1;
				cache.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: {
						getPosts: allPosts,
					},
				});
			}
		},
		variables: {
			postId,
			body: comment,
		},
	});

	function deletePostCallback() {
		props.history.push("/");
	}

	return !post || errMessage !== "" ? (
		errMessage !== "" ? (
			<p> {errMessage}</p>
		) : (
			<p>Loading post..</p>
		)
	) : (
		<Grid>
			<Grid.Row>
				<Grid.Column width={2}>
					<Image
						src="https://react.semantic-ui.com/images/avatar/large/molly.png"
						size="small"
						float="right"
					/>
				</Grid.Column>
				<Grid.Column width={10}>
					<Card fluid>
						<Card.Content>
							<Card.Header>{post.username}</Card.Header>
							<Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>
							<Card.Description>{post.body}</Card.Description>
							<br />
							{post.images?.map((image) => {
								return (
									<img
										key={image.imageLink}
										alt="postImage"
										src={"http://localhost:5000/" + image.imageLink}
										style={{
											width: "100px", 
											height: "auto"
										}}
									></img>
								);
							})}
						</Card.Content>
						<hr />
						<Card.Content extra>
							<LikeButton user={user} post={post} />
							<MyPopup content="Comment on post">
								<Button
									as="div"
									labelPosition="right"
									onClick={() => console.log("Comment on post")}
								>
									<Button basic color="blue">
										<Icon name="comments" />
									</Button>
									<Label basic color="blue" pointing="left">
										{post.commentCount}
									</Label>
								</Button>
							</MyPopup>
							{user && user.username === post.username && (
								<DeleteButton postId={post.id} callback={deletePostCallback} />
							)}
						</Card.Content>
					</Card>
					{user && (
						<Card fluid>
							<Card.Content>
								<p>Post a comment</p>
								<Form>
									<div className="ui action input fluid">
										<input
											type="text"
											placeholder="Comment.."
											name="comment"
											value={comment}
											onChange={(event) => setComment(event.target.value)}
											ref={commentInputRef}
										/>
										<button
											type="submit"
											className="ui button teal"
											disabled={comment.trim() === ""}
											onClick={submitComment}
										>
											Submit
										</button>
									</div>
								</Form>
							</Card.Content>
						</Card>
					)}
					{comments?.map((comment) => (
						<Card fluid key={comment.id}>
							<Card.Content>
								{user && user.username === comment.username && (
									<DeleteButton postId={post.id} commentId={comment.id} />
								)}
								<Card.Header>{comment.username}</Card.Header>
								<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
								<Card.Description>{comment.body}</Card.Description>
							</Card.Content>
						</Card>
					))}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}

const SUBMIT_COMMENT_MUTATION = gql`
	mutation($postId: String!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			body
			id
			createdAt
			username
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query getPost($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
			images {
				imageLink
			}
		}
	}
`;

export default SinglePost;
