const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const BLOG = require("../models/blog");
const COMMENT = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-blog", (req, res) => {
  return res.render("addBlog");
});

router.get("/:id", async (req, res) => {
  const blog = await BLOG.findById(req.params.id).populate("createdBy");
  const comments = await COMMENT.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

//Comment Post
router.post("/comment/:id", async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  await COMMENT.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.id}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await BLOG.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
