const Genre = require("./model");
const AppError = require("../../utils/appError");
const configs = require("../../configs");

//creating a create book

exports.createGenre = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      return next(new AppError("Missing required fields", 400));
    }

    const existsingTitle = await Genre.findOne({ title });

    if (existsingTitle) {
      return next(new AppError("Title already exist.", 400));
    }

    //creating a new genre entry
    const genre = await Genre.create(req.body);

    //return the new book entry
    res.status(200).json({
      status: "SUCCESS",
      message: "The new genre entry was added successfully",
      data: {
        genre,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get genre by id
exports.getGenreById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const genre = await Genre.findById(id);

    if (!genre) {
      return next(new AppError("Genre does not.", 400));
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        genre,
      },
    });
  } catch (error) {
    next(error);
  }
};

//update genre entries
exports.updateGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return next(new AppError("Missing required fields", 400));
    }

    const genre = await Genre.findByIdAndUpdate(id, { title }, { new: true });

    if (!genre) {
      return next(new AppError("Genre does not exist.", 404));
    }

    res.status(200).json({
      status: "SUCCESS",
      message:"genre title updated successfuly"
    });
  } catch (error) {
    next(error);
  }
};

//get all genres
exports.getAllGenres = async (req, res, next) => {
  try {
    const genre = await Genre.find();

    res.status(200).json({
      status: "SUCCESS",
      data: {
        genre
      },
    });
  } catch (error) {
    next(error);
  }
};

//delete a genre entries
exports.deleteGenre = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Genre.findByIdAndDelete(id);

    res.status(200).json({
      status: "SUCCESS",
      message: "Genre deleted successfuly!!",
    });
  } catch (error) {
    next(error);
  }
};

//delete genres
exports.deleteAllGenres = async (req, res, next) => {
  try {
    if (req.body.deleteKey !== configs.deleteKey) {
      return next(new AppError("Please provide the correct delete key.", 400));
    }

    await Genre.deleteMany({});

    res.status(200).json({
      status: "SUCCESS",
      message: "Genres deleted successfuly!!",
    });
  } catch (error) {
    next(error);
  }
};
