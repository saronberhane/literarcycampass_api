const Rate = require("../rates/model");
const AppError = require("../../utils/appError");
const Book = require("../Book/model");
const Reviews = require("../reviews/model");

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

exports.removeAllRates = async (req, res, next) => {
    try {

        const books = await Rate.deleteMany({})
        await Reviews.deleteMany({});

        res.status(200).json({
            status: "SUCCESS",
            data: {books}
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

        const newRate = await Rate.create({
            user_id: user.id,
            book_id: bookId,
            amount: rate
        })

        const ratedBooks = await Rate.find({book_id: bookId})

        let overalRate = 0;
        ratedBooks.forEach((book)=>{
            overalRate+=parseInt(book.amount);
        })


        const averageRate = parseFloat(overalRate / ratedBooks.length)

        const book = await Book.findByIdAndUpdate(bookId, {
            rate: averageRate
        }, {new: true})
        
        res.status(200).json({
            status: "SUCCESS",
            message: `Book rated successfuly!!!`,
            data: {newRate}
        });

    } catch (error) {
        console.log(error)
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