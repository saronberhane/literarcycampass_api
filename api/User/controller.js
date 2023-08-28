const UserModel = require("./model");
const bcrypt = require("bcrypt");
const cloudinary = require("../../utils/cloudinary");
const checkKeysExist = require("../../utils/checkInputKeys");

const { createJWT } = require("../../utils/createToken");
const AppError = require("../../utils/appError");
const User = require("./model");
const Author = require("../Author/model");

//create user
module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName,picture_pub_id,picture_url } = req.body;

    const data = req.body;
    if (!email || !password || !firstName || !lastName|| !picture_url || !picture_pub_id) {
      return next(
        new AppError(
          "Please provide your password, email, firstName, lastName",
          400
        )
      );
    }

    const existsingUser = await User.findOne({ email });

    if (existsingUser) {
      return next(new AppError("Account already exists!", 400));
    }

    
    const encryptedPassword = await bcrypt.hash(password, 10);

    data.password = encryptedPassword;

    if(req.body.bio){
      data.bio = req.body.bio;
    }

    const user = await UserModel.create(data);

    res.status(201).json({
      message: "User Created Successfuly!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//to login
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Invalid password of email", 400));
    }

    //search
    const user = await UserModel.findOne({ email: email });

    //does it exists
    if (!user) {
      return next(new AppError("Invalid password of email", 400));
    }

    if(!user.is_active){
      return next(new AppError(`Due to your recent inapproprate review, 
      Your account is banned from the platform`, 400));
    }

    //compare
    const checkUser = await bcrypt.compare(password, user.password);

    //validate
    if (!checkUser) {
      return next(new AppError("Invalid password of email", 400));
    }

    const token = createJWT(user.id, "Client");

    res.status(201).json({
      status: "SUCCESS",
      data: { user: user },
      token,
    });
  } catch (error) {
    next(error);
  }
};

//to view a current user profile
module.exports.viewProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;

    //search
    const user = await UserModel.findById(currentUser._id)
      .select("-password")
      .populate({
        path: "following_readers",
        select: `-password -picture_pub_id -email -is_active -followers
         -following_readers -following_authors -reviews -favorite_books -role -updatedAt`,
      })
      .populate({
        path: "following_authors",
        select: "full_name picture_url about followers",
      })
      .populate({
        path: "favorite_books",
        select: "title about cover_url price Date no_of_page language",
      });

    res.status(201).json({
      status: "SUCCESS",
      data: { user: user },
    });
  } catch (error) {
    next(error);
  }
};

//to view another user profile
module.exports.viewReaderProfile = async (req, res, next) => {
  try {
    const {id} = req.params;

    //search
    const user = await UserModel.findById(id)
      .select("-password -updatedAt -role -is_active -picture_pub_id -reviews")
      .populate({
        path: "following_readers",
        select: `-password -picture_pub_id -email -is_active -followers
         -following_readers -following_authors -reviews -favorite_books -role -updatedAt`,
      })
      .populate({
        path: "following_authors",
        select: "full_name picture_url about followers",
      })
      .populate({
        path: "favorite_books",
        select: "title about cover_pub_id price Date no_of_page language",
      });

    res.status(201).json({
      status: "SUCCESS",
      data: { user: user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.changeStatus = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {is_active} = req.body;

    //search
    await UserModel.findByIdAndUpdate(id, {
      is_active
    })

    res.status(201).json({
      status: "SUCCESS",
      message:`account status ${is_active ? 'activated' : "deactivated"} successfuly!!`
    });
  } catch (error) {
    next(error);
  }
};


//to add book to favorites
module.exports.addBookToFavorite = async (req, res, next) => {
  try {
    //book id
    const {id} = req.body;

    const currentUser = req.user;

    const alreadyAddedBook = await UserModel.findOne({
      $and: [{ _id: currentUser._id }, { favorite_books: id }],
    });

    if (alreadyAddedBook) {
      return next(new AppError("You have already added this book to favorites!", 400));
    }

    //search
    const user = await UserModel.findByIdAndUpdate(
      currentUser._id,
      { $push: { favorite_books: id } },
      { new: true }
    ).select("-password")
    .populate({
      path: "following_readers",
      select: `-password -picture_pub_id -email -is_active -followers
       -following_readers -following_authors -reviews -favorite_books -role -updatedAt`,
    })
    .populate({
      path: "following_authors",
      select: "full_name picture_url about followers",
    })
    .populate({
      path: "favorite_books",
      select: "title about cover_pub_id price Date no_of_page language",
    });

    res.status(201).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
//to remove book from favorites
module.exports.removeBookFromFavorite = async (req, res, next) => {
  try {
    //book id
    const {id} = req.body;

    const currentUser = req.user;

    const alreadyAddedBook = await UserModel.findOne({
      $and: [{ _id: currentUser._id }, { favorite_books: id }],
    });

    if (!alreadyAddedBook) {
      return next(new AppError("You dont have this book in favorites", 404));
    }

    //search
    const user = await UserModel.findByIdAndUpdate(
      currentUser._id,
      { $pull: { favorite_books: id } },
      { new: true }
    ).select("-password")
    .populate({
      path: "following_readers",
      select: `-password -picture_pub_id -email -is_active -followers
       -following_readers -following_authors -reviews -favorite_books -role -updatedAt`,
    })
    .populate({
      path: "following_authors",
      select: "full_name picture_url about followers",
    })
    .populate({
      path: "favorite_books",
      select: "title about cover_pub_id price Date no_of_page language",
    });

    res.status(201).json({
      status: "SUCCESS",
      message:"book successfuly removed from favorites!",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

//to update a current user profile
module.exports.updateAccount = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const data = req.body;

    if(checkKeysExist(data, ['firstName, lastName, bio'])){
      return next(new AppError("please provide the approprate fields", 400));
    }

    const existingUser = await UserModel.findById(currentUser._id);

    if(!existingUser){
      return next(new AppError("User does not exist", 404));
    }

    if(req.file){
      const upload = await cloudinary.v2.uploader.upload(req.file.path);
      data.picture_url = upload.secure_url;
      data.picture_pub_id = upload.public_id;

      await cloudinary.v2.uploader.destroy(existingUser.picture_pub_id);
    }

    const user = await UserModel.findByIdAndUpdate(currentUser._id, data, {new: true})
      .select("-password")
      .populate({
        path: "following_readers",
        select: `-password -picture_pub_id -email -is_active -followers
         -following_readers -following_authors -reviews -favorite_books -role -updatedAt`,
      })
      .populate({
        path: "following_authors",
        select: "full_name picture_url about followers",
      });

    res.status(201).json({
      status: "SUCCESS",
      message:"Profile updated successfuly",
      data: { user: user }
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

//to follow another user
module.exports.followReader = async (req, res, next) => {
  try {
    //following user id
    const { id } = req.body;

    const currentUser = req.user;

    if (id === currentUser._id) {
      return next(new AppError("You can not follow your self", 400));
    }

    const alreadyFollowing = await UserModel.findOne({
      $and: [{ _id: currentUser._id }, { following_readers: id }],
    });

    if (alreadyFollowing) {
      return next(new AppError("You are already following this reader", 400));
    }

    //search
    const user = await UserModel.findByIdAndUpdate(
      currentUser._id,
      { $push: { following_readers: id } },
      { new: true }
    ).select("-password")
    .populate({
      path: "following_readers",
      select: `-password -picture_pub_id -email -is_active -followers
       -following_readers -following_authors -reviews -favorite_books -role -updatedAt`,
    })
    .populate({
      path: "following_authors",
      select: "full_name picture_url about followers",
    })
    .populate({
      path: "favorite_books",
      select: "title about cover_pub_id price Date no_of_page language",
    });

    res.status(201).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

//to unfollow another user
module.exports.unFollowReader = async (req, res, next) => {
  try {
    //following user id
    const { id } = req.body;

    const currentUser = req.user;

    if (id === currentUser._id) {
      return next(new AppError("You can not unfollow your self", 400));
    }

    const alreadyFollowing = await UserModel.findOne({
      $and: [{ _id: currentUser._id }, { following_readers: id }],
    });

    if (!alreadyFollowing) {
      return next(new AppError("You are not following this reader", 400));
    }

    //remove
    const user = await UserModel.findByIdAndUpdate(
      currentUser._id,
      { $pull: { following_readers: id } },
      { new: true }
    ).select("-password")
    .populate({
      path: "following_readers",
      select: `-password -picture_pub_id -email -is_active -followers
       -following_readers -following_authors -reviews -favorite_books -role -updatedAt`,
    })
    .populate({
      path: "following_authors",
      select: "full_name picture_url about followers",
    })
    .populate({
      path: "favorite_books",
      select: "title about cover_pub_id price Date no_of_page language",
    });

    res.status(201).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

//to unfollow autho
module.exports.unFollowAuthor = async (req, res, next) => {
  try {
    //following user id
    const { id } = req.body;

    const currentUser = req.user;

    if (id === currentUser._id) {
      return next(new AppError("You can not follow your self", 400));
    }

    const alreadyFollowing = await UserModel.findOne({
      $and: [{ _id: currentUser }, { following_authors: id }],
    });

    if (!alreadyFollowing) {
      return next(new AppError("You are not following this author", 400));
    }

    //remove
    const user = await UserModel.findByIdAndUpdate(
      currentUser._id,
      { $pull: { following_authors: id } },
      { new: true }
    ).select("-password")
    .populate({
      path: "following_readers",
      select: `-password -picture_pub_id -email -is_active -followers
       -following_readers -following_authors -reviews -favorite_books -role -updatedAt`,
    })
    .populate({
      path: "following_authors",
      select: "full_name picture_url about followers",
    })
    .populate({
      path: "favorite_books",
      select: "title about cover_pub_id price Date no_of_page language",
    });

    res.status(201).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

//to follow Author
module.exports.followAuthor = async (req, res, next) => {
  try {
    //following author id
    const { id } = req.body;

    const currentUser = req.user;

    if (id === currentUser._id) {
      return next(new AppError("You can not follow your self", 400));
    }

    const alreadyFollowing = await UserModel.findOne({
      $and: [{ _id: currentUser._id }, { following_authors: id }],
    });

    if (alreadyFollowing) {
      return next(new AppError("You are already following this Author", 400));
    }

    //search
     await UserModel.findByIdAndUpdate(
      currentUser._id,
      { $push: { following_authors: id } },
      { new: true }
    );
    
    const author = await Author.findByIdAndUpdate(
      id,
      { $push: { followers: id } },
      { new: true }
    )

    res.status(201).json({
      status: "SUCCESS",
      data: { author },
    });
  } catch (error) {
    next(error);
  }
};

//to get all users
module.exports.getAllUsers = async (req, res, next) => {
  try {
    
    const user = await UserModel.find()

    res.status(201).json({
      status: "SUCCESS",
      results: user.length,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

//to get weekly users
module.exports.weeklyCreatedUsers = async (req, res, next) => {
  try {
    
    const user = await UserModel.aggregate([
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

    res.status(201).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

//to get monthly users
module.exports.monthlyCreatedUsers = async (req, res, next) => {
  try {
    
    const user = await UserModel.aggregate([
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

    res.status(201).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

//to get yearly users
module.exports.yearlyCreatedUsers = async (req, res, next) => {
  try {
    
    const user = await UserModel.aggregate([
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

    res.status(201).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
