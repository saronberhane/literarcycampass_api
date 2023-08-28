const { Schema, model } = require('mongoose');

const genreSchema = new Schema(
    {
        title: {
            type: String, 
            maxlength: [100, "Title can not exceed 100 characters"],
            minlength: [3, "Title can not be less than 3 character"],
        },
    },
    { timestamps: true }
);

const Genre = model('Genre', genreSchema);
module.exports = Genre;