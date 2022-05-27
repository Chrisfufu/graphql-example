import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  query {
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
      images{
        serverFile
      }
      # comments {
      #   id
      #   username
      #   createdAt
      #   body
      # }
    }
  }
`;
