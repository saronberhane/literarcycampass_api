const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            unique: true,
            required: [true, "Please provide your full name"],
            maxlength: [200, "Full name can not exceed 200 characters"],
            minlength: [2, "Full name can not be less than 2 character"],
        },
        birth_date: {
          type: Date,
          required: [true, "Please provide authors birth date"]
        },
        website: {
          type: String, 
          unique: true,
        },
        amazon_url: {
          type: String, 
          unique: true,
        },
        about: {
            type: String, 
            required: [true, "Please provide about data"]
        },
        picture_url: {
            type: String, 
            required: [true, "Please provide an image"]
        },
        picture_pub_id: {
            type: String, 
            required: [true, "Please provide a image pub id"]
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }]
    },
        
    { timestamps: true }
    
)

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;




