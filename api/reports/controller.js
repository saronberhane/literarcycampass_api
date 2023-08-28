const Genre = require("./model");
const AppError = require("../../utils/appError");
const configs = require("../../configs");
const Report = require("./model");
const Review = require("../reviews/model");

//creating a report

exports.addReport = async (req, res, next) => {
  try {
    const { reported_user,book_id, review_id } = req.body;

    if (!reported_user || !book_id || !review_id) {
      return next(new AppError("Missing required fields", 400));
    }

    const existsingReport = await Report.findOne({
        $and:[{reporting_user: req.user.id}, {book_id}, {reported_user}]
    });

    if (existsingReport) {
      return next(new AppError("Report already sent to system admins.", 400));
    }

    const data = req.body;
    data.reporting_user = req.user.id;

    //creating a new report entry
    await Report.create(data);


    res.status(200).json({
      status: "SUCCESS",
      message: "The report has been sent successfuly, we'll take a look at it soon!!",
    });
  } catch (error) {
    next(error);
  }
};

//view most reports
exports.getReporteds = async (req, res, next) => {
  try {

    const existsingReview = await Report.find().populate({
        path:"reported_user",
        select: "firstName lastName picture_url"
    }).populate({
        path:"reporting_user",
        select: "firstName lastName picture_url"
    })
    .populate({
        path:"book_id",
        select: "title"
    })
    .populate({
        path:"review_id",
        select: "review_message"
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

exports.deleteRport = async (req, res, next) => {
  try {

    const existsingReview = await Report.deleteMany({})
    
    if (existsingReview.length === 0) {
      return next(new AppError("No report found.", 404));
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "report deleted successfuly"
    });
  } catch (error) {
    next(error);
  }
};

exports.removeReview = async (req, res, next) => {
  try {
    const {review_id} = req.body;
    const existsingReview = await Review.findByIdAndDelete(review_id);
    await Report.findOneAndDelete({review_id})
    
    if (!existsingReview) {
      return next(new AppError("No report found.", 404));
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "review removed successfuly"
    });
  } catch (error) {
    next(error);
  }
};

exports.removeReview = async (req, res, next) => {
  try {
    const {review_id} = req.body;
    const existsingReview = await Review.findByIdAndDelete(review_id);
    await Report.findOneAndDelete({review_id})
    
    if (!existsingReview) {
      return next(new AppError("No report found.", 404));
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "review removed successfuly"
    });
  } catch (error) {
    next(error);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const {id} = req.params;
    const existsingReview = await Report.findById(id)
    .populate({
      path:"reported_user",
      select: "firstName lastName picture_url"
  }).populate({
      path:"reporting_user",
      select: "firstName lastName picture_url"
  })
  .populate({
      path:"book_id",
      select: "title"
  })
  .populate({
      path:"review_id",
      select: "review_message"
  })
    
    if (!existsingReview) {
      return next(new AppError("No report found.", 404));
    }

    res.status(200).json({
      status: "SUCCESS",
      data:{
        report: existsingReview
      }
    });
  } catch (error) {
    next(error);
  }
};
