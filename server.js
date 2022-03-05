const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override')
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const store = require("connect-mongo");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const app = express();


app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("trust proxy",1);

app.use(methodOverride('_method'))

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1200000,
    },
    store: store.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});


app.get("/", (req, res) => {
  res.render("home");
});


const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);


const postRouter = require("./routes/post.routes");
app.use("/post", postRouter);


const commentRouter = require("./routes/comment.routes");
app.use("/comment", commentRouter);

app.listen(process.env.PORT);

