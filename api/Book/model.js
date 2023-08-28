const { Schema, model, mongoose } = require('mongoose');

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please enter a title"],
            maxlength: [150, "Title can not exceed 150 characters"],
            minlength: [3, "Title can not be less than 3 character"],
        },
        author: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Author',
          required: true
        }],
        about:{
            type: String,
            required: [true, "Please enter about"],
            maxlength: [1000, "About can not exceed 1000 characters"],
            minlength: [3, "About can not be less than 3 character"],
        },
        genre: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Genre',
            required: true
        }],
        cover_url: {
            type: String, 
            required: [true, "Please provide a cover image"]
        },
        cover_pub_id: {
            type: String, 
            required: [true, "Please provide a cover image"]
        },
        publicationDate : {
            type: Date, 
            require: [true, "Please provide a published date of the book"],
        },
        no_of_page: {
            type: Number,
            required: [true, "Please provide the number of pages this book has"],
        },
        language: {
            type: String,
            required: [true, "Please provide the book language"],
        },
        rate: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }

);

const Book = model('Books', bookSchema);
module.exports = Book;