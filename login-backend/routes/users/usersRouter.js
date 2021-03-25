var express = require("express");
var router = express.Router();

// Import functions from userController
var { signUp, login } = require("./controller/userController");

// Imports functions from validator
var {
	checkIfEmptyMiddleware,
	checkForSymbolMiddleware,
	checkLoginIsEmpty,
} = require("../lib/validator");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

// Validate sign-up credentials, then add to database
router.post(
	"/sign-up",
	checkIfEmptyMiddleware,
	checkForSymbolMiddleware,
	signUp
);

// Check if login fields are empty, then check valid login credentials
router.post("/login", checkLoginIsEmpty, login);

module.exports = router;
