const db = require("../config/connection");
const { Comment, Donation, Post, User } = require("../models");
const commentSeed = require("./commentseed.json");
const donationSeed = require("./donationseed.json");
const postSeed = require("./postseed.json");
const userSeeds = require("./userseed.json");
const cleanDB = require("./cleanDB");

db.once("open", async () => {
  try {
    //Clear the database collections:
    await cleanDB("User", "users");
    await cleanDB("Post", "posts");
    await cleanDB("Comment", "comments");
    await cleanDB("Donation", "donations");

    // 1. Seed users and get their IDs
    const insertedUsers = await User.create(userSeeds);

    // 2. Create a mapping of usernames to their ObjectIds
    const userMapping = {};
    insertedUsers.forEach((user) => {
      userMapping[user.username] = user._id;
    });

    // 3. Adjust the post seeding data to use the correct ObjectIds for authors
    const updatedPostSeed = postSeed.map((post) => {
      post.author = userMapping[post.author.replace("ObjectId_of_", "")];
      return post;
    });

    // 4. Seed posts and get their IDs
    const insertedPosts = await Post.create(updatedPostSeed);

    // 5. Create a mapping of post contents to their ObjectIds (assuming content is unique)
    const postMapping = {};
    insertedPosts.forEach((post) => {
      postMapping[post.content] = post._id;
    });

    // 6. Adjust the comment and donation seeding data
    const updatedCommentSeed = commentSeed.map((comment) => {
      comment.author = userMapping[comment.author.replace("ObjectId_of_", "")];
      comment.post = postMapping[comment.post.replace("ObjectId_of_", "")];
      return comment;
    });

    const updatedDonationSeed = donationSeed.map((donation) => {
      donation.donor = userMapping[donation.donor.replace("ObjectId_of_", "")];
      donation.receiver =
        userMapping[donation.receiver.replace("ObjectId_of_", "")];
      donation.post = postMapping[donation.post.replace("ObjectId_of_", "")];
      return donation;
    });

    // Seed comments
    await Comment.create(updatedCommentSeed);

    // Seed donations
    await Donation.create(updatedDonationSeed);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("all done!");
  process.exit(0);
});
