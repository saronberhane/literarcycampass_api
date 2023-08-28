const cloudinary = require("cloudinary");
const configs = require("../configs");

cloudinary.config({
    cloud_name: configs.cloudinary.name,
    api_key: configs.cloudinary.api_key,
    api_secret: configs.cloudinary.secret
});

module.exports = cloudinary;