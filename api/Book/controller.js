const Book = require("./model");
const Rate = require("../rates/model");
const AppError = require("../../utils/appError")
const cloudinary = require('../../utils/cloudinary');
const configs = require("../../configs");
const Reviews = require("../reviews/model");

//creating a create book 

exports.createBook = async (req, res, next) => {
    try {
        const {
            title,
            about,
            author,
            date,
            language,
            no_of_page,
            cover_url,
            genre,
            cover_pub_id
        } = req.body;

        if (!title || !about || !date || !language || !no_of_page || !cover_url
            || !cover_pub_id ) {
            return next(new AppError("Missing required fields", 400));
        }

        console.log(req.body.author)
        //creating a new book entry 
        const book = await Book.create({
            title,
            about,
            author,
            genre,
            Date: date,
            language,
            no_of_page: parseInt(no_of_page),
            cover_url,
            cover_pub_id,
            author: author,
            genre: genre
        });

        //return the new book entry
        res.status(200).json({
            status: "SUCCESS",
            message: "The new book entry was added successfully",
            data: {
                book,
            },
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
};

//get book by genre or price 
exports.getByGenreOrPrice = async (req, res, next) => {
    try {
        const book = await Book.getByGenreOrPrice({
            genre: req.query.genre,
            price: req.query.price,
        });

        if (book.length === 0) {
            return next(new AppError("Book not found.", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            data: {
                book,
            },
        });
    } catch (error) {
        next(error);
    }
};

//get book by rate order 
exports.mostratedBoks = async (req, res, next) => {
    try {
        const book = await Book.find().sort("-rate");

        if (book.length === 0) {
            return next(new AppError("Book not found.", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            data: {
                book,
            },
        });
    } catch (error) {
        next(error);
    }
};

//get all book entries 
exports.getAllBooks = async (req, res, next) => {
    try {
        const book = await Book.find()
        .populate({
            path: "author",
            select: "full_name picture_url about followers",
          })
          .populate({
            path: "genre",
            select: "title",
          })
        .sort("-createdAt");

        res.status(200).json({
            status: "SUCCESS",
            data: {
                book,
            },
        });
    } catch (error) {
        next(error);
    }
};

//get a book 
exports.getBook = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;

        const book = await Book.findById(id)
        .populate({
            path: "author",
            select: "full_name picture_url followers birth_date",
          })
        .populate({
            path: "genre",
            select: "title",
          });
      

        if (!book) {
            return next(new AppError("Book does not exist.", 404));
        }
        res.status(200).json({
            status: "SUCCESS",
            data: {
                book
            },
        });
    } catch (error) {
        next(error);
    }
};

//update books information
exports.updateBook = async (req, res, next) => {
    try {
        const existsingBook = await Book.findById(req.params.id);

        if (!existsingBook) {
            return next(new AppError("There is no book with this ID", 404));
        }

        const data = req.body;

        if (req.body.cover_pub_id) {
            await cloudinary.v2.uploader.destroy(existsingBook.cover_pub_id);
        }

        const book = await Book.findByIdAndUpdate(req.params.id, data, {
            new: true
        })
        .populate({
            path: "author",
            select: "full_name picture_url about followers",
          })
          .populate({
            path: "genre",
            select: "title",
          })
        .sort("-createdAt");

        res.status(200).json({
            status: "SUCCESS",
            message: "Book information has successfully been updated",
            data: {
                book,
            },
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
};

//delete a book information 
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book)
            return next(new AppError("Book Does not exist!", 403));

        await Book.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "SUCCESS",
            message: `Book with the title ${book.title} was deleted successfully`,
        });
    } catch (error) {
        next(error);
    }
};


//delete all books information 
exports.deleteAllBooks = async (req, res, next) => {
    try {
        if (req.body.deleteKey !== configs.deleteKey) {
            return next(new AppError("Please provide the correct delete key.", 400));
        }

        await Book.deleteMany({});
        res.status(200).json({
            status: "SUCCESS",
            message: "The book information were all deleted"
        });
    } catch (error) {
        next(error);
    }
};

//Search book
exports.searchBook = async (req, res, next) => {
    try {
        const data = req.query;
        console.log(data)
        if (!data) {
            return next(new AppError("Missing search fields", 400));
        }

        //search for Books by title
        const books = await Book.find(data)
        .populate({
            path: "author",
            select: "full_name picture_url about followers",
          })
          .populate({
            path: "genre",
            select: "title",
          })
        .sort("-createdAt");

        if (books.length === 0) {
            return next(new AppError("No books found with requested data.", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            message: `There are ${books.length} results`,
            data: {
                books,
            },
        });
    } catch (error) {
        next(error);
    }
};

//rate book
exports.rateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const user = req.user;
        const rate = req.body.rate;

        if (!rate || parseInt(rate) < 0 || parseInt(rate) > 5) {
            return next(new AppError("Please provide rate value", 400))
        }

        const bookIsRated = await Rate.findOne({
            $and: [{
                user_id: user.id
            }, {
                book_id: bookId
            }]
        })
        if (bookIsRated) {
            return next(new AppError("You have already given a rate for this book!", 404))
        }

        await Rate.create({
            user_id: user.id,
            book_id: bookId,
            amount: rate
        })

        const ratedBooks = await Rate.find({book_id: bookId})

        let overalRate = 0;
        ratedBooks.forEach((book)=>{
            book.rate ? overalRate+=book.rate : null;
        })

        const bookRate = parseFloat(overalRate / ratedBooks.length)

        const book = await Book.findByIdAndUpdate(bookId, {
            rate: bookRate
        }, {new: true})
        .populate({
            path: "author",
            select: "full_name picture_url about followers",
          })
          .populate({
            path: "genre",
            select: "title",
          })
        .sort("-createdAt");
        
        res.status(200).json({
            status: "SUCCESS",
            message: `Book rated successfuly!!!`,
            data: {book}
        });

    } catch (error) {
        next(error);
    }
};

//remove rate
exports.removeRateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const user = req.user;

        const bookIsRated = await Rate.findOne({
            $and: [{
                user_id: user.id
            }, {
                book_id: bookId
            }]
        })

        if (!bookIsRated) {
            return next(new AppError("You have no rating record of this book previously!", 404))
        }

        await Rate.findOneAndDelete({
            $and: [{
                user_id: user.id
            }, {
                book_id: bookId
            }]
        })

        const ratedBooks = await Rate.find({book_id: bookId})

        if(ratedBooks.length !== 0){
            let overalRate = 0;
            ratedBooks.forEach((book)=>{
                book.amount ? overalRate+=book.amount : null;
            })

            const bookRate = parseFloat(overalRate / ratedBooks.length)

            const book = await Book.findByIdAndUpdate(bookId, {
                rate: bookRate
            }, {new: true})
        }
        

        res.status(200).json({
            status: "SUCCESS",
            message: `Book rate removed successfuly!!!`
        });

    } catch (error) {
        next(error);
    }
};

//view my rates
exports.viewRatedBooks = async (req, res, next) => {
    try {
        const user = req.user;

        const books = await Rate.find({user_id: user._id})
        .populate({
            path: "book_id",
            select: "title cover_url language",
          })

        if (books.length === 0) {
            return next(new AppError("You have no rating record previously!", 404))
        }

        res.status(200).json({
            status: "SUCCESS",
            data: {books}
        });

    } catch (error) {
        next(error);
    }
};

//get new and most rated books
exports.newBooks = async (req, res, next) => {
    try {
        //latest book
        const book = await Book.find()
        .populate({
            path: "author",
            select: "full_name picture_url about followers",
          })
        .populate({
            path: "genre",
            select: "title",
          })
        .sort("-createdAt");

        // checking the returned book genre
        if (!book)
            return next(new AppError("Result not found with this genre", 400));

        res.status(200).json({
            status: "SUCCESS",
            results: book.length,
            data: {
                books: book,
            },
        });
    } catch (error) {
        next(error);
    }
};

//filter all books by genre
exports.filterBooksByGenre = async (req, res, next) => {
    try {
        const {
            genre
        } = req.params;

        const book = await Book.find({genre})
        .populate({
            path: "author",
            select: "full_name picture_url about followers",
          })
          .populate({
            path: "genre",
            select: "title",
          })
        .sort("-createdAt");

        // checking the returned book genre
        if (!book)
            return next(new AppError("Result not found with this genre", 400));

        res.status(200).json({
            status: "SUCCESS",
            results: book.length,
            data: {
                books: book,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.getByAuthorId = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;

        const book = await Book.find({author: id})
        .populate({
            path: "author",
            select: "full_name picture_url about followers",
          })
          .populate({
            path: "genre",
            select: "title",
          })
        .sort("-createdAt");

        // checking the returned book genre
        if (!book)
            return next(new AppError("Author Book not found", 400));

        res.status(200).json({
            status: "SUCCESS",
            results: book.length,
            data: {
                books: book,
            },
        });
    } catch (error) {
        next(error);
    }
};
exports.getBookReviews = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;

        const book = await Reviews.find({book_id: id})
        .populate({
            path: "user_id",
            select: "firstName picture_url lastName followers",
          })
          .populate({
            path: "rate_id",
            select: "amount",
          })
        .sort("-createdAt");

        // checking the returned book genre
        if (!book)
            return next(new AppError("Sorry this book does not seem to have any reviews", 400));

        res.status(200).json({
            status: "SUCCESS",
            results: book.length,
            data: {
                books: book,
            },
        });
    } catch (error) {
        next(error);
    }
};

//filter books by published dates 
exports.filterBooksByPublishedDate = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate
        } = req.query;
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            return next(new AppError("Invalid startDate or endDate. Provide valid date strings.", 400));
        }

        // Filter books by published date range
        const filteredBooks = await BookModel.find({
                publicationDate: {
                    $gte: parsedStartDate,
                    $lte: parsedEndDate,
                },
            })
            .filter()
            .sort({
                title: 1
            }); // Sorting by title?

        if (filteredBooks.length === 0) {
            return next(new AppError("No books found for the given published date range.", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            results: filteredBooks.length,
            data: {
                books: filteredBooks,
            },
        });
    } catch (error) {
        next(error);
    }
};