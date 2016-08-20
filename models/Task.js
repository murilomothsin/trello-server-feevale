var mongoose = require('mongoose');

    var TaskSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        state: Number,
        responsibles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        created_at: {type: Date, default: Date.now},
        creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

    });

module.exports = mongoose.model("Task", TaskSchema)