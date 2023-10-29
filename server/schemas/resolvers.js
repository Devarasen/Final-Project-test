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
  },

  Mutation: {
    addUser: async (parent, { input }, context) => {
      const user = await User.create(input);
      console.log(user);
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

      console.log(user);
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
  }
  },
};

module.exports = resolvers;
