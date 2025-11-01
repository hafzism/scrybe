import mongoose, { Schema, models } from 'mongoose';

if (models.Post) {
  delete models.Post;
}

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    default: '',
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: '',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, 
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', PostSchema);

export default Post;