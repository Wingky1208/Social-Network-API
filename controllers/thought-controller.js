const { Thought, User } = require('../models');

const thoughtController = {
    //get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .sort({ createdAt: -1 })
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    //get a single thought by id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((thoughts) =>
                !thoughts
                    ? res.status(404).json({ message: 'No thoughts with that ID' })
                    : res.json(thoughts)
            )
            .catch((err) => res.status(500).json(err));
    },

    // create a new thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((dbThoughtData) => {
                //console.log(req.body);
                return User.findOneAndUpdate(
                    {
                        _id: req.body.userId
                    },
                    {
                        $addToSet: { thoughts: dbThoughtData._id }
                    },
                    {
                        runValidators: true,
                        new: true,
                    }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'Thought has been created but cannot find user with this id!' });
                }
                res.json({ message: 'Thought has been created!🎉' });
            })
            .catch((err) => res.status(500).json(err));
    },

    // update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            {
                _id: req.params.thoughtId
            },
            {
                $set: req.body
            },
            {
                runValidators: true,
                new: true
            }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(500).json(err));
    },

    //delete thoughts
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought with that ID' });
                }

                // remove thought id from user's `thoughts` field
                return User.findOneAndUpdate(
                    {
                        thoughts: req.params.thoughtId
                    },
                    {
                        $pull: { thoughts: req.params.thoughtId }
                    },
                    {
                        runValidators: true,
                        new: true
                    }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'Thought has been deleted but no user with this id!' });
                }
                res.json({ message: 'Thought has been deleted!' });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //add reaction to the thought
    addReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId },
            {
                $addToSet:
                    { reactions: req.body }
            },
            {
                runValidators: true,
                new: true
            })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought with that ID.' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Remove a reaction from thoughts
    removeReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId },
            {
                $pull: { reactions: { reactionId: req.params.reactionId } }
            },
            {
                runValidators: true,
                new: true
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with that ID.' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
};


module.exports = thoughtController;

