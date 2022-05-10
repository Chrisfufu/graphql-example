
import {
	GraphQLUpload
} from "graphql-upload";

import { finished } from "stream/promises";

export default {
	Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (parent, { file }) => {
			const { createReadStream, filename, mimetype, encoding } = await file;

			// Invoking the `createReadStream` will return a Readable Stream.
			// See https://nodejs.org/api/stream.html#stream_readable_streams
			const stream = createReadStream();
			console.log("aba", filename);
			// This is purely for demonstration purposes and will overwrite the
			// local-file-output.txt in the current working directory on EACH upload.
			// const out = require("fs").createWriteStream(filename);
			stream.pipe(out);
			await finished(out);

			return { filename, mimetype, encoding };
		},
  }
};
