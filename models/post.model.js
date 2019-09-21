const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true},
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: mongoose.Schema.Types.Array, required: true },
    thumbnail: { type: String, required: true },
})

module.exports = mongoose.model("User", userSchema);