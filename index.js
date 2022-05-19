import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { join } from "path";
import path from "path";
import {
	GraphQLUpload,
	graphqlUploadExpress, // A Koa implementation is also exported.
} from "graphql-upload";
import { finished } from "stream/promises";
import mongoose from "mongoose";

import customSchema from "./graphql/directives/index.js";

import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import config from "./config.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const pubsub = new PubSub();

const PORT = process.env.port || 5000;
const corsOptions = {
	origin: ["http://localhost:3000", "https://studio.apollographql.com"],
	// credentials: true
};

const app = express();
app.use(graphqlUploadExpress());

app.use(express.static(join(__dirname, "./uploads")));
console.log("customschema", customSchema);
const server = new ApolloServer({
	// typeDefs,
	// resolvers,
	context: ({ req }) => ({ req }),
	schema: customSchema,
	csrfPrevention: true, // see below for more about this
	
});

async function startServer() {
	try {
		await mongoose.connect(config.MONGODB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		let db = mongoose.connection;
		db.on("error", () => {
			console.error("Error while connecting to DB");
		});
		console.log("Mongo DB connection success");
		await server.start();

		server.applyMiddleware({ app, cors: corsOptions });

		await new Promise((r) => app.listen({ port: PORT }, r));

		console.log(
			`🚀 Server ready at http://localhost:${PORT + server.graphqlPath}`
		);
	} catch (err) {
		console.error(`error: ${err}`);
	}
}

startServer();
