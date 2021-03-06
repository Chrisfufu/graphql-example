import { GraphQLUpload } from "graphql-upload";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { finished } from "stream/promises";
import path, { join, parse } from "path";
import { fileURLToPath } from "url";
import checkAuth from "../../util/check-auth.js";
import File from "../../models/File.js";
import Post from "../../models/Post.js";

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

export default {
	Upload: GraphQLUpload,
	Mutation: {
		singleUpload: async (parent, { file }) => {
			try {
				const { filename, createReadStream, mimetype, encoding } = await file;
				let stream = createReadStream();

				let { ext, name } = parse(filename);

				name = name.replace(/([^a-z0-9 ]+)/gi, "-").replace(" ", "_");

				let serverFile = join(
					__dirname,
					`../../uploads/${name}-${Date.now()}${ext}`
				);

				serverFile = serverFile.replace(" ", "_");

				let writeStream = createWriteStream(serverFile);

				await stream.pipe(writeStream);

				serverFile = `${serverFile.split("uploads\\")[1]}`;
				await finished(writeStream);
				
				return { filename, mimetype, encoding, serverFile };
			} catch (err) {
				console.log("err", err);
				// throw new ApolloError(err.message);
			}
		},
	},
};
