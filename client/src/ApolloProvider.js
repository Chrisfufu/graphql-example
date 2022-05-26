import React from "react";
import App from "./App";
import { createHttpLink } from "apollo-link-http";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider, ApolloClient, InMemoryCache, from  } from '@apollo/client'
import { setContext } from "@apollo/client/link/context";

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
const allLink = from([authLink, uploadLink, httpLink])

const cache = new InMemoryCache();

const client = new ApolloClient({
	link: allLink,
	cache,
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
