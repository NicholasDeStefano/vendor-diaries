/**
 * Created by nickdestefano on 6/23/15.
 */
var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    createdAt: { type: Date, default : Date.now },
    title: String,
    link: String,
    author: String,
    upvotes: [String],
    category: String,
    description: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

mongoose.model('Post', PostSchema);