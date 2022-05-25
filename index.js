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

import config from "./config.js";
import { fileURLToPath } from "url";
import AuthMiddleware from "./middlewares/auth.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { RedisPubSub } from "graphql-redis-subscriptions";
export const pubsub = new RedisPubSub();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.port || 5000;
const corsOptions = {
	origin: [
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"https://studio.apollographql.com",
		"*",
	],
	credentials: true,
};

const app = express();
app.use(graphqlUploadExpress());
app.use(AuthMiddleware);

app.use(express.static(join(__dirname, "./uploads")));
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
	server: httpServer,
	path: "/graphql",
});
const serverCleanup = useServer({ schema: customSchema }, wsServer);

const server = new ApolloServer({
	context: ({ req }) => {
		let { user, isAuth } = req;

		return {
			req,
			user,
			isAuth,
		};
	},
	schema: customSchema,
	// csrfPrevention: true, // see below for more about this
	plugins: [
		// Proper shutdown for the HTTP server.
		ApolloServerPluginDrainHttpServer({ httpServer }),

		// Proper shutdown for the WebSocket server.
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose();
					},
				};
			},
		},
	],
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

		// httpServer.applyMiddleware({ app, cors: corsOptions });
		// await new Promise((r) => httpServer.listen({ port: PORT }, r));
		httpServer.listen(PORT, () => {
			console.log(`🚀 Server ready at http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error(`error: ${err}`);
	}
}

startServer();
