import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
      _id
      content
      timestamp
      author {
        username
        profile {
          image
        }
      }
      comments {
        content
        author {
          username
        }
        timestamp
      }
    }
  }
`;
