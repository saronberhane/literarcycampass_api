const dotenv = require("dotenv");
dotenv.config({ path: "./configs.env" });

module.exports = {
  env: process.env.NODE_ENV,
  db: {
    remote: process.env.DB_REMOTE,
  },
  jwt:process.env.SECRET,
  expiresIn: process.env.EXPIRESIN,
  deleteKey: process.env.DELETEKEY,
  cloudinary:{
    name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.API_SECRET
  }
};
