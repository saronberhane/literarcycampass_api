const Book = require("../Book/model");
const Author = require('../Author/model');
const User = require("../User/model");

exports.totalAmount = async (req, res, next) => {
  try {    

    
    const numberOfBooks = await Book.find().count();
    const numberofAuthors = await Author.find().count();
    const numberOfUsers = await User.find({is_active: true}).count();

    const amount = {
      numberOfBooks,
      numberofAuthors,
      numberOfUsers
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {amount}
    });

  } catch (error) {
    next(error);
  }
};

exports.listEveryUsers = async (req, res, next) => {
  try {    

    const users = await User.find();

    res.status(200).json({
      status: "SUCCESS",
      result: users.length,
      data: {users}
    });

  } catch (error) {
    next(error);
  }
};

exports.usersStat = async (req, res, next) => {
  try {    

    const weeklyUsers = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $isoWeek: "$createdAt" }
          },
          users: { $push: "$$ROOT" } // Store the user documents in an array
        }
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 }
      },
      {
        $project: {
          _id: 0,
          createdAt: {
            $dateFromParts: {
              isoWeekYear: "$_id.year",
              isoWeek: "$_id.week"
            }
          },
          totalCreated: { $size: "$users" },
          users: 1
        }
      }
    ]);

    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          users: { $push: "$$ROOT" } // Store the user documents in an array
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          createdAt: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month"
            }
          },
          totalCreated: { $size: "$users" },
          users: 1
        }
      }
    ]);

    const yearlyUsers = await User.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
          users: { $push: "$$ROOT" } // Store the user documents in an array
        }
      },
      {
        $sort: { "_id": 1 }
      },
      {
        $project: {
          _id: 0,
          createdAt: { $toString: "$_id" },
          totalCreated: { $size: "$users" },
          users: 1
        }
      }
    ]);

    const readableWeeklyAmount = []
    const readableWeeklyDate = []
    weeklyUsers.forEach((day)=>{
      readableWeeklyAmount.push(day.totalCreated)
      readableWeeklyDate.push(day.createdAt ? day.createdAt.toString().slice(0, 10) : new Date())
    })

    const readableMonthlyAmount = []
    const readableMonthlyDate = []
    monthlyUsers.forEach((day)=>{
      readableMonthlyAmount.push(day.totalCreated)
      readableMonthlyDate.push(day.createdAt ? day.createdAt.toString().slice(0, 10) : new Date())
    })

    const readableYearyAmount = []
    const readableYearyDate = []
    yearlyUsers.forEach((day)=>{
      readableYearyAmount.push(day.totalCreated)
      readableYearyDate.push(day.createdAt ? day.createdAt.toString().slice(0, 10) : new Date())
    })

    const readableData = {
      weekly: {
        readableWeeklyAmount,
        readableWeeklyDate
      },
      monthly:{
        readableMonthlyAmount,
        readableMonthlyDate
      },
      yearly:{
        readableYearyAmount,
        readableYearyDate
      }
    }


    res.status(200).json({
      status: "SUCCESS",
      data: {
        readableData
      }
    });

  } catch (error) {
    next(error);
  }
};