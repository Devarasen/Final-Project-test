import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        username
      }
    }
  }
`;




export const CREATE_POST = gql`
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      _id
      content
      timestamp
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      _id
      content
      author {
        username
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