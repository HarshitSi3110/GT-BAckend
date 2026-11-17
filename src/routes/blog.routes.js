
const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blog.controller");

// PUBLIC ROUTES
router.get("/public", blogController.getPublicBlogs);
router.get("/public/:slug", blogController.getPublicBlogBySlug);

// ADMIN ROUTES
router.post("/", blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
