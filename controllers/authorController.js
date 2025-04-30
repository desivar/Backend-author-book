const Author = require('../models/author');

// @desc    Create a new author
// @route   POST /api/authors
// @access  Public
exports.createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    
    res.status(201).json({
      success: true,
      data: author
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all authors
// @route   GET /api/authors
// @access  Public
exports.getAuthors = async (req, res, next) => {
  try {
    // Query parameters for filtering
    const { firstName, lastName, nationality } = req.query;
    
    // Build query object
    const queryObj = {};
    
    if (firstName) {
      queryObj.firstName = { $regex: firstName, $options: 'i' };
    }
    
    if (lastName) {
      queryObj.lastName = { $regex: lastName, $options: 'i' };
    }
    
    if (nationality) {
      queryObj.nationality = { $regex: nationality, $options: 'i' };
    }
    
    // Find authors with the given query
    const authors = await Author.find(queryObj);
    
    res.status(200).json({
      success: true,
      count: authors.length,
      data: authors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single author
// @route   GET /api/authors/:id
// @access  Public
exports.getAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: author
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update author
// @route   PUT /api/authors/:id
// @access  Public
exports.updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: author
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete author
// @route   DELETE /api/authors/:id
// @access  Public
exports.deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }
    
    await author.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};