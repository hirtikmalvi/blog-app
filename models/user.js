const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "/images/profile.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  //   console.log("This: ", user);

  const salt = randomBytes(16).toString();
  //   console.log("SALT: ", salt);

  //   console.log("User Password Before: ", user.password);

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.password = hashedPassword;
  user.salt = salt;

  //   console.log("User Password After: ", user.password);
  //   console.log("hashedPassword: ", hashedPassword);

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error((err) => console.log("User Not Found!", err));

    const salt = user.salt;
    const hashedPassword = user.password; //Hashed PWD from the Database

    //Hashing the entered Password with the same salt from user.salt (This salt is taken from the DB stored while signup.)
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (userProvidedHash !== hashedPassword) {
      throw new Error("Incorrect Password!");
    }

    const token = createTokenForUser(user);
    return token;
  }
);

const USER = mongoose.model("user", userSchema);

module.exports = USER;
