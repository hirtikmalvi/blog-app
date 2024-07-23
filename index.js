const express = require("express");
const app = express();
const PORT = 434;
const path = require("path");
const { connectToMongo } = require("./connection");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const BLOG = require("./models/blog");

//Routes
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

//Connection Of MongoDB
connectToMongo();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

//Setting Up View
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//Custom Middleware to pass the cookie throughout the Routes
app.use(checkForAuthenticationCookie("token"));

app.get("/", async (req, res) => {
  const allBlogs = await BLOG.find({});
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log("SERVER CONNECTED!!!");
});
