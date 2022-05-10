// const postsResolvers = require('./posts');
// const usersResolvers = require('./users');
// const commentsResolvers = require('./comments');
// const fileResolvers = require('./file');

// module.exports = {
//   Post: {
//     likeCount: (parent) => parent.likes.length,
//     commentCount: (parent) => parent.comments.length
//   },
//   Upload:{
//     ...fileResolvers.Upload,
//   },
//   Query: {
//     ...postsResolvers.Query,
//     ...usersResolvers.Query
//   },
//   Mutation: {
//     ...usersResolvers.Mutation,
//     ...postsResolvers.Mutation,
//     ...commentsResolvers.Mutation,
//     ...fileResolvers.Mutation,
//   },
//   // Subscription: {
//   //   ...postsResolvers.Subscription
//   // }
// };


import comments from "./comments.js"
import file from "./file.js"
import posts from "./posts.js"
import users from "./users.js"

export default [
  comments,
  file,
  posts,
  users, 
]