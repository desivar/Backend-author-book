const { body, param, validationResult } = require('express-validator');

// Validator middleware to check results
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// Author validation rules
const authorValidationRules = {
  create: [
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ max: 50 }).withMessage('First name cannot be more than 50 characters'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ max: 50 }).withMessage('Last name cannot be more than 50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('biography')
      .optional()
      .isLength({ max: 2000 }).withMessage('Biography cannot be more than 2000 characters'),
    body('dateOfBirth')
      .optional()
      .isISO8601().withMessage('Please provide a valid date'),
    body('awards.*.name')
      .if(body('awards').exists())
      .notEmpty().withMessage('Award name is required'),
    body('awards.*.year')
      .if(body('awards').exists())
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage(`Award year must be between 1800 and ${new Date().getFullYear()}`),
    validateResult
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid author ID'),
    body('firstName')
      .optional()
      .trim()
      .notEmpty().withMessage('First name cannot be empty')
      .isLength({ max: 50 }).withMessage('First name cannot be more than 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .notEmpty().withMessage('Last name cannot be empty')
      .isLength({ max: 50 }).withMessage('Last name cannot be more than 50 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Please provide a valid email'),
    body('biography')
      .optional()
      .isLength({ max: 2000 }).withMessage('Biography cannot be more than 2000 characters'),
    body('dateOfBirth')
      .optional()
      .isISO8601().withMessage('Please provide a valid date'),
    validateResult
  ],
  delete: [
    param('id').isMongoId().withMessage('Invalid author ID'),
    validateResult
  ],
  getById: [
    param('id').isMongoId().withMessage('Invalid author ID'),
    validateResult
  ]
};

// Book validation rules
const bookValidationRules = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
    body('author')
      .notEmpty().withMessage('Author is required')
      .isMongoId().withMessage('Invalid author ID'),
    body('publishedDate')
      .notEmpty().withMessage('Published date is required')
      .isISO8601().withMessage('Please provide a valid date'),
    body('isbn')
      .trim()
      .notEmpty().withMessage('ISBN is required')
      .isLength({ max: 20 }).withMessage('ISBN cannot be more than 20 characters'),
    body('genre')
      .isArray({ min: 1 }).withMessage('At least one genre is required')
      .custom(genres => {
        const validGenres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 
                          'Romance', 'Western', 'Dystopian', 'Contemporary', 'Memoir', 'Biography', 
                          'History', 'Science', 'Self-Help', 'Business', 'Other'];
        return genres.every(genre => validGenres.includes(genre));
      }).withMessage('Please provide valid genres'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 5000 }).withMessage('Description cannot be more than 5000 characters'),
    body('price')
      .notEmpty().withMessage('Price is required')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('pageCount')
      .notEmpty().withMessage('Page count is required')
      .isInt({ min: 1 }).withMessage('Page count must be at least 1'),
    body('language')
      .trim()
      .notEmpty().withMessage('Language is required'),
    body('publisher')
      .trim()
      .notEmpty().withMessage('Publisher is required'),
    body('stockQuantity')
      .isInt({ min: 0 }).withMessage('Stock quantity cannot be negative'),
    body('format')
      .notEmpty().withMessage('Format is required')
      .isIn(['Hardcover', 'Paperback', 'E-Book', 'Audiobook']).withMessage('Please provide a valid format'),
    body('reviews.*.rating')
      .if(body('reviews').exists())
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('reviews.*.user')
      .if(body('reviews').exists())
      .notEmpty().withMessage('User is required for review'),
    body('reviews.*.comment')
      .if(body('reviews').exists())
      .notEmpty().withMessage('Comment is required for review'),
    validateResult
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid book ID'),
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Title cannot be empty')
      .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
    body('author')
      .optional()
      .isMongoId().withMessage('Invalid author ID'),
    body('publishedDate')
      .optional()
      .isISO8601().withMessage('Please provide a valid date'),
    body('isbn')
      .optional()
      .trim()
      .notEmpty().withMessage('ISBN cannot be empty')
      .isLength({ max: 20 }).withMessage('ISBN cannot be more than 20 characters'),
    body('genre')
      .optional()
      .isArray({ min: 1 }).withMessage('At least one genre is required')
      .custom(genres => {
        const validGenres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 
                          'Romance', 'Western', 'Dystopian', 'Contemporary', 'Memoir', 'Biography', 
                          'History', 'Science', 'Self-Help', 'Business', 'Other'];
        return genres.every(genre => validGenres.includes(genre));
      }).withMessage('Please provide valid genres'),
    body('description')
      .optional()
      .trim()
      .notEmpty().withMessage('Description cannot be empty')
      .isLength({ max: 5000 }).withMessage('Description cannot be more than 5000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('pageCount')
      .optional()
      .isInt({ min: 1 }).withMessage('Page count must be at least 1'),
    body('stockQuantity')
      .optional()
      .isInt({ min: 0 }).withMessage('Stock quantity cannot be negative'),
    body('format')
      .optional()
      .isIn(['Hardcover', 'Paperback', 'E-Book', 'Audiobook']).withMessage('Please provide a valid format'),
    validateResult
  ],
  delete: [
    param('id').isMongoId().withMessage('Invalid book ID'),
    validateResult
  ],
  getById: [
    param('id').isMongoId().withMessage('Invalid book ID'),
    validateResult
  ]
};

module.exports = {
  authorValidationRules,
  bookValidationRules
};