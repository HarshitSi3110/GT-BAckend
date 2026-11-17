
const Blog = require("../models/blog.model");

// Generate SEO-friendly slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Generate unique slug
const generateUniqueSlug = async (title, customSlug = "", excludeId = null) => {
  const baseSlug = generateSlug(customSlug || title);

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingBlog = await Blog.findOne(query).select("_id");

    if (!existingBlog) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;
    count++;
  }
};

// Escape search text for regular expressions
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      seo,
      status
    } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt and content are required"
      });
    }

    const finalSlug = await generateUniqueSlug(title, slug);

    const blog = await Blog.create({
      title,
      slug: finalSlug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      seo,
      status: status || "draft",
      publishedAt: status === "published" ? new Date() : null
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog
    });

  } catch (error) {
    console.error("Create Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message
    });
  }
};

// GET ALL BLOGS (ADMIN)
exports.getAllBlogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const { status, search, category } = req.query;

    const filter = {};

    if (status && ["draft", "published", "inactive"].includes(status)) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { category: searchRegex },
        { tags: searchRegex }
      ];
    }

    const [blogs, total, statusCounts] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Blog.countDocuments(filter),

      Blog.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const counts = {
      total: 0,
      draft: 0,
      published: 0,
      inactive: 0
    };

    statusCounts.forEach(item => {
      counts[item._id] = item.count;
      counts.total += item.count;
    });

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      counts
    });

  } catch (error) {
    console.error("Get Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
};

// GET SINGLE BLOG (ADMIN)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog
    });

  } catch (error) {
    console.error("Get Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message
    });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    const allowedFields = [
      "title",
      "excerpt",
      "content",
      "featuredImage",
      "category",
      "tags",
      "seo",
      "status"
    ];

    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.title !== undefined || req.body.slug !== undefined) {
      updates.slug = await generateUniqueSlug(
        req.body.title || blog.title,
        req.body.slug !== undefined ? req.body.slug : blog.slug,
        blog._id
      );
    }

    // Set publish date when a blog is published for the first time
    if (
      updates.status === "published" &&
      blog.status !== "published"
    ) {
      updates.publishedAt = new Date();
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("Update Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message
    });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    console.error("Delete Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message
    });
  }
};

// GET PUBLISHED BLOGS (PUBLIC)
exports.getPublicBlogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    const filter = { status: "published" };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select(
          "title slug excerpt featuredImage category tags seo.title seo.description publishedAt createdAt"
        )
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Blog.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      message: "Published blogs fetched successfully",
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get Public Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch published blogs",
      error: error.message
    });
  }
};

// GET SINGLE PUBLISHED BLOG BY SLUG (PUBLIC)
exports.getPublicBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published"
    }).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog
    });

  } catch (error) {
    console.error("Get Public Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message
    });
  }
};
