// const { User, Post, Comment, Donation } = require("../models");
// const { signToken } = require("../utils/auth");
// const { AuthenticationError } = require("apollo-server-express");

// const resolvers = {
//   Query: {
//     me: async (_, __, context) => {
//       if (context.user) {
//         return User.findOne({ _id: context.user._id });
//       }
//       throw new AuthenticationError("Not logged in.");
//     },
//     getAllPosts: async () => {
//       try {
//         return await Post.find().populate(["author", "comments", "donations"]);
//       } catch (error) {
//         throw new Error(error);
//       }
//     },
//     getUserPosts: async (_, { userId }) => {
//       try {
//         return await Post.find({ author: userId }).populate([
//           "author",
//           "comments",
//           "donations",
//         ]);
//       } catch (error) {
//         throw new Error(error);
//       }
//     },
//     getUserProfile: async (_, { userId }) => {
//       try {
//         return await User.findById(userId).populate([
//           "posts",
//           "donationsReceived",
//         ]);
//       } catch (error) {
//         throw new Error(error);
//       }
//     },
//     getAllComments: async () => {
//       try {
//         return await Comment.find().populate(["author", "post"]);
//       } catch (error) {
//         throw new Error(error);
//       }
//     },
//     getCommentById: async (_, { id }) => {
//       try {
//         return await Comment.findById(id);
//       } catch (error) {
//         throw new Error(error);
//       }
//     },
//   },

//   Mutation: {
//     addUser: async (parent, { input }, context) => {
//       const user = await User.create(input);
//       console.log(user);
//       const token = signToken(user);
//       return { token, user };
//     },

//     login: async (parent, { input }, context) => {
//       const { email, password } = input;
//       const user = await User.findOne({ email });

//       if (!user) {
//         throw new AuthenticationError("No user found with that email address.");
//       }

//       const correctPassword = await user.isCorrectPassword(password);

//       if (!correctPassword) {
//         throw new AuthenticationError("Incorrect password.");
//       }

//       console.log(user);
//       const token = signToken(user);
//       return { token, user };
//     },

//     createPost: async (parent, { content }, context) => {
//       if (!context.user) {
//         throw new AuthenticationError("You need to be logged in to post!");
//       }

//       const newPost = new Post({
//         content,
//         author: context.user._id,
//         timestamp: new Date().toISOString(),
//       });

//       await newPost.save();
//       return newPost;
//     },
//   },

//   Post: {
//     comments: async (post) => {
//       // Fetch comments for the given post using the post's _id
//       return await Comment.find({ post: post._id });
//     },


//   },
// };

// module.exports = resolvers;


const { User, Post, Comment, Donation } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("Not logged in.");
    },

    getAllPosts: async () => {
      try {
        return await Post.find().populate(["author", "comments", "donations"]);
      } catch (error) {
        throw new Error(error);
      }
    },

    getUserPosts: async (_, { userId }) => {
      try {
        return await Post.find({ author: userId }).populate([
          "author",
          "comments",
          "donations",
        ]);
      } catch (error) {
        throw new Error(error);
      }
    },

    getUserProfile: async (_, { userId }) => {
      try {
        return await User.findById(userId).populate([
          "posts",
          "donationsReceived",
        ]);
      } catch (error) {
        throw new Error(error);
      }
    },

    getAllComments: async () => {
      try {
        return await Comment.find().populate(["author", "post"]);
      } catch (error) {
        throw new Error(error);
      }
    },

    getCommentById: async (_, { id }) => {
      try {
        return await Comment.findById(id);
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    addUser: async (parent, { input }, context) => {
      const user = await User.create(input);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { input }, context) => {
      const { email, password } = input;
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with that email address.");
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Incorrect password.");
      }

      const token = signToken(user);
      return { token, user };
    },

    createPost: async (parent, { content }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in to post!");
      }

      const newPost = new Post({
        content,
        author: context.user._id,
        timestamp: new Date().toISOString(),
      });

      await newPost.save();
      return newPost;
    },

    addComment: async (parent, { postId, content }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in to comment!");
      }

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found.");
      }

      const newComment = new Comment({
        post: postId,
        content,
        author: context.user._id,
        timestamp: new Date().toISOString(),
      });

      await newComment.save();

      post.comments.push(newComment._id);
      await post.save();

      return Post.findById(postId).populate(["author", "comments", "donations"]);
    },
  },

  Post: {
    comments: async (post) => {
      return await Comment.find({ post: post._id }).populate("author");
    },
  },
};

module.exports = resolvers;
