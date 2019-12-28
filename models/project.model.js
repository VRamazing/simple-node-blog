const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true, unique:true},
    description: { type: String, required: true },
    usp: { type: String, required: true },
    technologyUsed: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    liveLink: { type: String},
    detailLink: { type: String, required: true },
    dateStarted: { type: Date, default: Date.now },
    dateCompleted: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Post", projectSchema);