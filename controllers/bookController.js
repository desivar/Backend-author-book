const Book = require('../models/Book');
const Author = require('../models/author');

// @desc    Create a new book
// @route   POST /api/books
// @access  Public
exports.createBook = async (req, res, next) => {
  try {
    // Check if author exists
    const author = await Author.findById(req.body.author);
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }
    
    const book = await Book.create(req.body);
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    // Query parameters for filtering
    const { title, genre, minPrice, maxPrice, author, language, format } = req.query;
    
    // Build query object
    const queryObj = {};
    
    if (title) {
      queryObj.title = { $regex: title, $options: 'i' };
    }
    
    if (genre) {
      queryObj.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    }
    
    if (author) {
      queryObj.author = author;
    }
    
    if (language) {
      queryObj.language = { $regex: language, $options: 'i' };
    }
    
    if (format) {
      queryObj.format = format;
    }
    
    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      queryObj.price = {};
      
      if (minPrice !== undefined) {
        queryObj.price.$gte = Number(minPrice);
      }
      
      if (maxPrice !== undefined) {
        queryObj.price.$lte = Number(maxPrice);
      }
    }
    
    // Find books with the given query and populate author details
    const books = await Book.find(queryObj)
      .populate('author', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author', 'firstName lastName email');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Public
exports.updateBook = async (req, res, next) => {
  try {
    // If author is being updated, check if new author exists
    if (req.body.author) {
      const author = await Author.findById(req.body.author);
      if (!author) {
        return res.status(404).json({
          success: false,
          error: 'Author not found'
        });
      }
    }
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'firstName lastName email');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public
exports.deleteBook = async (req, res, next)