const Author = require("./model");
const AppError = require("../../utils/appError");
const cloudinary = require("../../utils/cloudinary");
const configs = require("../../configs");
const Book = require("../Book/model");
const checkKeysExist = require("../../utils/checkInputKeys");

//creating an author
exports.createAuthor = async (req, res, next) => {
  try {
    const { full_name, birth_date, website, amazon_url, about,picture_url,picture_pub_id } = req.body;

    if (
      !full_name ||
      !about ||
      !birth_date ||
      !website ||
      !amazon_url ||
      !about || 
      !picture_pub_id ||
      !picture_url
    ) {
      return next(new AppError("Missing required fields", 400));
    }

    const existsingAuthor = await Author.findOne({ full_name });

    if (existsingAuthor) {
      return next(new AppError("Author already exists.", 400));
    }

    const data = req.body;

    // if (req.file) {
    //   const upload = await cloudinary.v2.uploader.upload(req.file.path);
    //   data.picture_url = upload.secure_url;
    //   data.picture_pub_id = upload.public_id;
    // }

    //creating a new author entry
    const author = await Author.create(data);

    //return the new author entry
    res.status(200).json({
      status: "SUCCESS",
      message: "The new author entry was added successfully",
      data: {
        author,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get author by genre or price
exports.getByGenreOrPrice = async (req, res, next) => {
  try {
    const author = await Author.getByGenreOrPrice({
      genre: req.query.genre,
      price: req.query.price,
    });

    if (author.length === 0) {
      return next(new AppError("Author not found.", 404));
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        author,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get all author entries
exports.getAllAuthors = async (req, res, next) => {
  try {
    const author = await Author.find();

    res.status(200).json({
      status: "SUCCESS",
      data: {
        author,
      },
    });
  } catch (error) {
    next(error);
  }
};

//update authors information
exports.updateAuthorInfo = async (req, res, next) => {
  try {

    const data = req.body;

    if(checkKeysExist(data, ["full_name",
    "birth_date",
    "website",
    "amazon_url",
    "about"])){
      return next(new AppError("please provide the approprate fields", 400));
    }
    const existsingAuthor = await Author.findById(req.params.id);

    if (!existsingAuthor) {
      return next(new AppError("There is no author with this ID", 404));
    }

    // if (req.file) {
    //   const upload = await cloudinary.v2.uploader.upload(req.file.path);
    //   data.picture_url = upload.secure_url;
    //   data.picture_pub_id = upload.public_id;

    //   await cloudinary.v2.uploader.destroy(existsingAuthor.picture_pub_id);
    // }

    const author = await Author.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "Author information has successfully been updated",
      data: {
        author,
      },
    });
  } catch (error) {
    next(error);
  }
};

//update authors image
exports.updatAuthorImage = async (req, res, next) => {
  try {



    const existsingAuthor = await Author.findById(req.params.id);

    if (!existsingAuthor) {
      return next(new AppError("There is no author with this ID", 404));
    }

    const data = req.body;

    if (!req.body.image_secure_url) {
      return next(new AppError("Please insert image", 400));
    }
    
    data.picture_url = req.body.image_secure_url;
    data.picture_pub_id = req.body.image_public_id;

    await cloudinary.v2.uploader.destroy(existsingAuthor.picture_pub_id);
  

    await Author.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "Author image has successfully been updated"
    });
  } catch (error) {
    next(error);
  }
};

//get author information
exports.getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) return next(new AppError("Author does not exist", 404));

    res.status(200).json({
      status: "SUCCESS",
      data: { author },
    });
  } catch (error) {
    next(error);
  }
};

//delete author
exports.deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) return next(new AppError("Author does not exist", 404));

    await cloudinary.v2.uploader.destroy(author.picture_pub_id);

    await Author.findByIdAndDelete(req.params.id);

    await Book.deleteMany({author: req.params.id})

    res.status(200).json({
      status: "SUCCESS",
      message: `Author deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

//delete all authors
exports.deleteAllAuthors = async (req, res, next) => {
  try {

    if(req.body.deleteKey !== configs.deleteKey){
      return next(new AppError("Please provide the correct delete key.", 400));
    }

    const authors = await Author.find();

    authors.forEach(async (author) => {
      await cloudinary.v2.uploader.destroy(author.picture_pub_id);
    });

    await Author.deleteMany({});

    res.status(200).json({
      status: "SUCCESS",
      message: "All Authors information are deleted",
    });
  } catch (error) {
    next(error);
  }
};
