const { Schema, model, mongoose } = require('mongoose');

const reviewsSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        book_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Books',
        },
        rate_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rates',
        },
        review_message: {
            type: String, 
            maxlength: [500, "Review message can not exceed 500 characters"],
            minlength: [3, "Review message can not be less than 3 character"],
        }
    },
    { timestamps: true }
);

const Reviews = model('Reviews', reviewsSchema);
module.exports = Reviews;