const Genre = require("./model");
const AppError = require("../../utils/appError");
const configs = require("../../configs");
const Reviews = require("./model");

//creating a review

exports.addReview = async (req, res, next) => {
  try {
    const { book_id,rate_id, review_message } = req.body;

    if (!book_id || !rate_id || !review_message) {
      return next(new AppError("Missing required fields", 400));
    }

    const existsingReview = await Reviews.findOne({
        $and:[{user_id: req.user.id}, {book_id}]
    });

    if (existsingReview) {
      return next(new AppError("Review already added to this book.", 400));
    }

    const data = req.body;
    data.user_id = req.user.id;

    //creating a new review entry
    const review = await Reviews.create(data);

    //return the new book entry
    res.status(200).json({
      status: "SUCCESS",
      message: "The review added successfuly",
      data: {
        review,
      },
    });
  } catch (error) {
    next(error);
  }
};

//view my reviews
exports.viewMyReviewsOfBooks = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existsingReview = await Reviews.find({
        $and:[{user_id: req.user.id}, {book_id: id}]
    })
    .populate({
      path:"book_id",
      select:"title cover_url language rate"
    }).populate({
      path:"rate_id",
      select:"amount"
    })

    if (existsingReview.length === 0) {
      return next(new AppError("No reviews found.", 404));
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        review: existsingReview,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.findReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existsingReview = await Reviews.findById(id)
    .populate({
      path:"book_id",
      select:"title cover_url language rate"
    }).populate({
      path:"rate_id",
      select:"amount"
    })
    .populate({
      path:"user_id",
      select:"firstName lastName"
    })

    if (existsingReview.length === 0) {
      return next(new AppError("No reviews found.", 404));
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        review: existsingReview,
      },
    });
  } catch (error) {
    next(error);
  }
};
