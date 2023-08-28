const mongoose = require("mongoose");
const {isEmail} = require("validator")

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please provide your first name"],
            maxlength: [100, "First name can not exceed 100 characters"],
            minlength: [2, "First name can not be less than 2 character"],
        },
        lastName: {
          type: String,
          required: [true, "Please provide your last name"],
          maxlength: [100, "Last name can not exceed 100 characters"],
          minlength: [2, "Last name can not be less than 2 character"],
        },
        email: {
          type: String, 
          require: [true, "Please provide and email"],
          maxlength: [100, "Email can not exceed 100 characters"],
          minlength: [1, "Email can not be less than 1 character"],
          unique: true,
          validation: [ isEmail, "Please enter a vaild email." ]
        },
        password: {
            type: String, 
            required: [true, "Please provide a password"]
        },
        picture_url: {
            type: String, 
            required: [true, "Please provide an image"]
        },
        picture_pub_id: {
            type: String, 
            required: [true, "Please provide a image pub id"]
        },
        
        bio: {
            type: String, 
            maxlength: [300, "bio can not excced more than 300 character"],
            minlength: [1, 'bio can not be less than 1 character']
        },
        is_active: {
            type: Boolean, 
            default: true
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }],
        following_readers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }],
        following_authors: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Author'
        }],
        reviews: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Reviews'
        }],
        favorite_books: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Books'
        }],
        role: {
          type: String,
          default:"Client"
        }
    },
        
    { timestamps: true }
    
)

const User = mongoose.model('Users', userSchema);
module.exports = User;