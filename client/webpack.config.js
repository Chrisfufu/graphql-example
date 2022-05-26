const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: path.join(__dirname, "src", "index.js"),
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
					},
				},
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
					extensions: [".wasm", ".mjs", ".js", ".jsx", ".json"],
				},
			},
			{
				test: /\.(sass|less|css)$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
				exclude: /node_modules/,
				use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "public", "index.html"),
			filename: "./index.html",
			favicon: "./public/favicon.ico",
			manifest: "./public/manifest.json",
		}),
	],
	devServer: {
		historyApiFallback: true,
		port: 3000,
		allowedHosts: 'all',
	},
};
