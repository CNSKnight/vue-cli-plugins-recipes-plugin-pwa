import mongoose from 'mongoose';
const recipeSchema = new mongoose.Schema({
  id: ObjectId,
  acapID: Number,
  creator: String,
  creationDate: Date,
  originalUrl: String,
  description: String,
  ingredients: [
    {
      qty: String,
      unit: String,
      name: String,
      optional: {
        type: Boolean,
        default: false,
      },
      preparation: String,
    },
  ],
  method: [
    {
      step: Number,
      text: String,
    },
  ],
  published: {
    type: Boolean,
    default: false,
  },
  publishedDate: Date,
  updatedDate: Date,
  rating: Number,
  subTitle: String,
  tags: [
    {
      priority: Number,
      text: String,
    },
  ],
  title: String,
  variations: [
    {
      text: String,
    },
  ],
  notes: String,
});

// recipeModel
export default mongoose.model('RecipeModel', recipeSchema);
