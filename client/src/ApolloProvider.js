import React from "react";
import App from "./App";
import { createUploadLink } from "apollo-upload-client";
import {
	ApolloProvider,
	ApolloClient,
	InMemoryCache,
	from,
	split,
	HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new GraphQLWsLink(
	createClient({
		url: "ws://localhost:5000/graphql",
	})
);
console.log('wsLink', wsLink);

const httpLink = new HttpLink({
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
const allLink = from([authLink, uploadLink, httpLink,  ]);

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		console.log('definition', definition);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	allLink,
	// authLink.concat(httpLink),
);

// passing freezeResults does not solve the issue of readQuery's data is immutable
const cache = new InMemoryCache({ freezeResults: false });

const client = new ApolloClient({
	// link: allLink,
	link: splitLink,
	cache,
	assumeImmutableResults: false,
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
