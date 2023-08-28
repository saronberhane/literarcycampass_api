const { Schema, model, mongoose } = require('mongoose');

const ratesSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        book_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Books',
        },
        amount : {
            type: Number,
            required: [true, "rate value is required"]
        }
    },
    { timestamps: true }
);

const Rate = model('Rates', ratesSchema);
module.exports = Rate;