import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: "",
	});
	const [file, setFile] = useState(null);
	const [postInput, setPostInput] = useState("");

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			let posts = JSON.parse(JSON.stringify(data.getPosts));
			posts = [result.data.createPost, ...posts];
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: {
					getPosts: posts,
				},
			});
			setPostInput("");
		},
	});

	function createPostCallback() {}
	const [uploadImage, { data, loadingimageupload, uploadingError }] =
		useMutation(IMAMGE_UPLAOD);

	function onSubmitfile() {
		// console.log("file", file);
		if (postInput !== "" && file) {
			uploadImage({ variables: { file: file } })
				.then((res) => {
					console.log("res", res);
					createPost({
						variables: {
							body: postInput,
							imagePaths: res.data.singleUpload.serverFile,
						},
					});
					setFile(null);
				})
				.catch((err) => {
					console.log("err", err);
				});
		} else {
			uploadImage({ variables: { file: file } })
				.then((res) => {
					console.log("res", res);
					setFile(null);
				})
				.catch((err) => {
					console.log("err", err);
				});
			console.log("there is no Post Input");
		}
		// if (!file){
		//   createPost();
		// }
	}

	return (
		<>
			<Form>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Hi World!"
						name="body"
						onChange={(e) => setPostInput(e.target.value)}
						value={postInput}
						error={error ? true : false}
					/>
					<input
						type="file"
						name="files"
						onChange={(e) => {
							setFile(e.target.files[0]);
						}}
						alt="image"
					/>
					<Button
						color="teal"
						onClick={() => {
							onSubmitfile();
						}}
					>
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul className="list">{/* <li>{error.graphQLErrors[0].message}</li> */}</ul>
				</div>
			)}
		</>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

const IMAMGE_UPLAOD = gql`
	mutation imageUploader($file: Upload!) {
		singleUpload(file: $file) {
			serverFile
		}
	}
`;

export default PostForm;
