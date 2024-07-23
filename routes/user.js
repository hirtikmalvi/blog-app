const express = require("express");
const router = express.Router();
const { createHmac, randomBytes } = require("crypto");
const USER = require("../models/user");

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await USER.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await USER.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (err) {
    res.render("signin", {
      error: "Incorrect Email or Password!",
    });
  }
});

router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});

module.exports = router;
