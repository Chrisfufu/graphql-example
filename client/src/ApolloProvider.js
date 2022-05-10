import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createHttpLink({
	uri: "http://localhost:5000/graphql",
});

const uploadLink = createUploadLink({
	uri: "http://localhost:5000/graphql",
});

const authLink = setContext(() => {
	const token = localStorage.getItem("jwtToken");
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});
const allLink = authLink.concat(uploadLink)

const client = new ApolloClient({
	link: allLink,
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
