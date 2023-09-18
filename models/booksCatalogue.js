const mongoose = require('mongoose')

const booksCatalogueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide name of recipe'],
      maxlength: 50,
    },
    author: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: 100,
    },
    genre: {
      type: String,
      required: [true, 'Please provide Ingredients'],
      maxlength: 1000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
)
booksCatalogueSchema.index({ title: 'text' });
booksCatalogueSchema.index({ createdAt: -1 });




module.exports = mongoose.model('Books', booksCatalogueSchema)