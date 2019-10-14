const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique:true},
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: mongoose.Schema.Types.Array, required: true },
    thumbnail: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Post", postSchema);