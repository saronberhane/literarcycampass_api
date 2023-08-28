const BookModel = require("./model");
const AppError = require("../../utils/appError");

class Book {
  static async createBook(data) {
    try {
      data.date = new Date(data.date);
      const newBook = BookModel.create({
        title: data.title,
        author: data.author,
        genre: data.genre,
        price: data.price,
        description: data.description,
        page: data.page,
      });
      return newBook;
    } catch (error) {
      next(error);
    }
  }

  //get by Genre Or Price
  static async getByGenreOrPrice({ genre, price }) {
    try {
      const book = await BookModel.find({
        $or: [{ genre }, { price: new Price(price) }],
      });
      return book;
    } catch (error) {
      next(error);
    }
  }

  //get all books information
  static async getAllBooks() {
    try {
      const book = await BookModel.find();
      return book;
    } catch (error) {
      next(error);
    }
  }

  //update book inforamtion
  static async updateBook() {
    try {
      const book = await BookModel.findByIdAndUpdate(
        id,
        {
          title: data.title,
          author: data.author,
          genre: data.genre,
          price: data.price,
          description: data.description,
          page: data.page,
        },
        { runValidators: true, new: true }
      );
      return book;
    } catch (error) {
      next(error);
    }
  }

  //deleting a book
  static async deleteBook(title) {
    try {
      await BookModel.findByIdAndDelete(title);
    } catch (error) {
      next(error);
    }
  }

  //deleting all book information
  static async deleteAllBooks() {
    try {
      await BookModel.deleteMany({});
    } catch (error) {
      next(error);
    }
  }

  //get by id
  static async getById(id) {
    try {
      return await BookModel.findById(id);
    } catch (error) {
      next(error);
    }
  }

  //search by title
  static async searchBookByTitle(title){
    try {
      const books = await BookModel.find({ $text: { $search: title } });
      return books;
    } catch (error) {
      throw error;
    }
  }

  //filter the books by the book title
  static async filterBooksByGenre(genre) {
    try {
      const books = await BookModel.find(genre);
      return books;
    } catch (error) {
      throw error;
    }
  }

  //filter the book by published dates
  static async filterBooksByPublishedDate({startDate, endDate}) {
    try {
       const filteredBooks = await BookModel.find({
      publicationDate: {
          $gte: parsedStartDate,
          $lte: parsedEndDate,
        },
      });
      return filteredBooks;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Book;
