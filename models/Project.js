var mongoose = require('mongoose');
var Board = require('./Board.js');

var ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    boards: [Board.schema],
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    created_at: {type: Date, default: Date.now},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

});

module.exports = mongoose.model("Project", ProjectSchema)