const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const store = require("connect-mongo");
const dotenv = require("dotenv");

mongoose.connect("mongodb://localhost/unicorn");

const app = express();

// environment variables
dotenv.config();

// template engine setup
app.set("view engine", "ejs");
// ejs layout setup
app.use(expressLayouts);
// middleware to extract the body from the request
app.use(express.urlencoded({ extended: false }));
// hooking up the public folder
app.use(express.static("public"));
// middleware for setting up the session
app.use(
  session({
    secret: "helloworld",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1200000,
    },
    store: store.create({
      mongoUrl: "mongodb://localhost/unicorn",
    }),
  })
);
// middle ware for making the user available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

// root route
app.get("/", (req, res) => {
  res.render("home");
});

// user routes
const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);

// post routes
const postRouter = require("./routes/post.routes");
app.use("/post", postRouter);

// post routes
const commentRouter = require("./routes/comment.routes");
app.use("/comment", commentRouter);

app.listen(process.env.PORT);

