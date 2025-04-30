const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  biography: {
    type: String,
    required: false,
    trim: true,
    maxlength: [2000, 'Biography cannot be more than 2000 characters']
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  nationality: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  website: {
    type: String,
    required: false,
    trim: true
  },
  socialMedia: {
    twitter: { type: String, required: false },
    facebook: { type: String, required: false },
    instagram: { type: String, required: false }
  },
  awards: [{
    name: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String, required: false }
  }]
}, {
  timestamps: true
});

// Create a compound index of firstName and lastName for faster searches
authorSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model('Author', authorSchema);