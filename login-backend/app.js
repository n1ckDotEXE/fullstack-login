var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
// It manages relationships between data, provides schema validation, and is used
// to translate between objects in code and the representation of those objects in MongoDB.
var mongoose = require("mongoose");

// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
// CORS is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain
// from which the first resource was served.
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users/usersRouter");

// Connects to MongoDB with .connect method
mongoose
	.connect("mongodb://localhost:27017/fullstack-login", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MONGO DB CONNECTED");
	})
	.catch((e) => {
		console.log(e);
	});

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Add cors() to Express middleware stack
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
