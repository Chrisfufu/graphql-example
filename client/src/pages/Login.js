import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Login(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});
	// const [file, setFile] = useState(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const history = useHistory();

	const [loginUser, { login_data, login_loading, login_error }] = useMutation(
		LOGIN_USER,
		{
			onCompleted: (data) => {
				context.login(data.login);
				history.push("/home");
			},
			onError: (err) => {
				console.log("Err", err);
			},
		}
	);

	// const [uploadImage, { data, loadingimageupload, error }] =
	// 	useMutation(IMAMGE_UPLAOD);

	function handleSubmit(e) {
		// console.log("handleSubmit", e);
		loginUser({ variables: { username: username, password: password } });
	}
	// function onSubmitfile(e) {
	// 	e.preventDefault();
	// 	// console.log("file", file);
	// 	uploadImage({ variables: { file: file } })
	// 		.then((res) => {
	// 			console.log("res", res);
	// 		})
	// 		.catch((err) => {
	// 			console.log("err", err);
	// 		});
	// }

	console.log(username, password);
	return (
		<div className="form-container">
			<Form
				onSubmit={handleSubmit}
				noValidate
				className={login_loading ? "loading" : ""}
			>
				<h1>Login</h1>
				<Form.Input
					label="Username"
					placeholder="Username.."
					name="username"
					type="text"
					// value={values.username}
					error={errors.username ? true : false}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<Form.Input
					label="Password"
					placeholder="Password.."
					name="password"
					type="password"
					// value={values.password}
					error={errors.password ? true : false}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button type="submit" primary>
					Login
				</Button>
			</Form>
			{/* <input
				type="file"
				id="avatar"
				name="avatar"
				accept="image/png, image/jpeg"
				onChange={(e) => {
					handleFileUploading(e);
				}}
			/> */}
			{/* <form onSubmit={onSubmitfile}>
				<input
					type="file"
					name="files"
					onChange={(e) => {
						setFile(e.target.files[0]);
					}}
					alt="image"
				/>
				<button type="submit">Send</button>
			</form> */}

			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

// const IMAMGE_UPLAOD = gql`
// 	mutation imageUploader($file: Upload!) {
// 		singleUpload(file: $file) {
// 			filename
// 		}
// 	}
// `;

export default Login;
