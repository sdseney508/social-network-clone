const { ObjectId } = require("mongoose").Types;
const { User, Thoughts, Thought } = require("../models");

module.exports = {
  // Get all users per readme
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a single user with their thought and friends field
  getAnUser(req, res) {
    User.findOne({ _id: req.params.userId }, "thought friends")
      .then(async (user) =>
        !student
          ? res.status(404).json({ message: "No User found for that ID" })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // create a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Put route to update a user
  updateUser(req, res) {
    console.log("You are updating this users data");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { username: req.params.username, email: req.params.email },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user and their thoughts for the bouns
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No such user exists" })
          : Thought.deleteMany({ username: req.body.username })
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: "user deleted, but no thoughts found",
            })
          : res.json({ message: "user and thoughts successfully deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // add a friend to a user
  addFriend(req, res) {
    console.log("You are adding a friend to this users list of friends");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.username } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  removeFriend(req, res) {
    console.log("You are removing a friend to this users list of friends");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.body.friendID } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
