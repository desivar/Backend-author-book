const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Author is required'],
    ref: 'Author'
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published date is required']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    maxlength: [20, 'ISBN cannot be more than 20 characters']
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required'],
    enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 
           'Romance', 'Western', 'Dystopian', 'Contemporary', 'Memoir', 'Biography', 
           'History', 'Science', 'Self-Help', 'Business', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  pageCount: {
    type: Number,
    required: [true, 'Page count is required'],
    min: [1, 'Page count must be at least 1']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    default: 'English'
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  format: {
    type: String,
    required: true,
    enum: ['Hardcover', 'Paperback', 'E-Book', 'Audiobook']
  },
  coverImage: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be between 0 and 5'],
    max: [5, 'Rating must be between 0 and 5'],
    default: 0
  },
  reviews: [{
    user: { type: String, required: true },
    rating: { 
      type: Number, 
      required: true,
      min: [1, 'Rating must be between 1 and 5'], 
      max: [5, 'Rating must be between 1 and 5']
    },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
bookSchema.index({ title: 'text', isbn: 1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ author: 1 });

module.exports = mongoose.model('Book', bookSchema);