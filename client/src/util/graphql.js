
import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
  query getPosts{
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      # images{
      #   imageLink
      # }
      # comments {
      #   id
      #   username
      #   createdAt
      #   body
      # }
    }
  }
`;
