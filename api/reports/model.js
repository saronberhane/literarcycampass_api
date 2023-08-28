const { Schema, model, mongoose } = require('mongoose');

const reportSchema = new Schema(
    {
        reporting_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        reported_user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        book_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Books',
        },
        review_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reviews',
        }
    },
    { timestamps: true }
);

const Report = model('Report', reportSchema);
module.exports = Report;