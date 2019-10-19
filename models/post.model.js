const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique:true},
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    detailLink: { type: String, required: true }
})

module.exports = mongoose.model("Post", postSchema);