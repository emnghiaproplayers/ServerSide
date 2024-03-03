var express = require("express");
var router = express.Router(); // Tạo một đối tượng router để xử lý các tuyến đường liên quan đến người dùng.
const bodyParser = require("body-parser"); // Middleware để phân tích các yêu cầu HTTP và truy cập dữ liệu được gửi đến từ form.
var User = require("../models/user");
// update passport
var passport = require("passport");
// JWT
var authenticate = require("../authenticate");
const user = require("../models/user");
const { verify } = require("jsonwebtoken");
// Sử dụng bodyParser
router.use(bodyParser.json());

router.get("/", authenticate.verifyAdmin, authenticate.verifyUser, (req, res) => {
  User.find({})
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.json(user);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
router.post("/signup", (req, res, next) => {
  //sử dụng passport để xác thực
  User.register(
    new User({ username: req.body.username, admin : req.body.admin || false}),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        user
          .save()
          .then((user) => {
            passport.authenticate("local")(req, res, () => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          })
          .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          });
      }
    }
  );
});
router.get("/:userId", (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
router.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
