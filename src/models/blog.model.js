
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    excerpt: {
      type: String,
      required: [true, "Blog short description is required"],
      trim: true,
      maxlength: 500
    },

    content: {
      type: String,
      required: [true, "Blog content is required"]
    },

    featuredImage: {
      url: {
        type: String,
        default: ""
      },
      alt: {
        type: String,
        default: ""
      }
    },

    category: {
      type: String,
      trim: true,
      default: "General"
    },

    tags: {
      type: [String],
      default: []
    },

    seo: {
      title: {
        type: String,
        trim: true,
        default: ""
      },
      description: {
        type: String,
        trim: true,
        default: ""
      },
      focusKeyword: {
        type: String,
        trim: true,
        default: ""
      },
      canonicalUrl: {
        type: String,
        trim: true,
        default: ""
      },
      allowIndexing: {
        type: Boolean,
        default: true
      }
    },

    status: {
      type: String,
      enum: ["draft", "published", "inactive"],
      default: "draft"
    },

    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Blog", blogSchema);
