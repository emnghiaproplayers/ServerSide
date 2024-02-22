const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Cakes = require("../models/cakes");
const cakeRouter = express.Router();
cakeRouter.use(bodyParser.json());

// Create, Read, Delete by cake
cakeRouter
  .route("/")
  .get((req, res, next) => {
    Cakes.find({})
      .then(
        (cake) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(cake);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Cakes.create(req.body)
      .then(
        (cake) => {
          console.log("cake created", cake);
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(cake);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Cakes");
  })
  .delete((req, res, next) => {
    Cakes.deleteMany({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

// Create, Read, Delete by cakeId

cakeRouter
  .route("/:cakeId")
  .get((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then(
        (Cakes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(Cakes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    Cakes.findByIdAndUpdate(
      req.params.cakeId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (cake) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(cake);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /Cakes" + req.params.cakeId);
  })
  .delete((req, res, next) => {
    Cakes.findByIdAndDelete(req.params.cakeId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

  //topping
cakeRouter
  .route("/:cakeId/toppings")
  .get((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then(
        (Cakes) => {
          if (Cakes != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.json(Cakes.topping);
          } else {
            err = new Error("cake " + req.params.cakeId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then((cake) => {
        if (cake != null) {
          cake.topping.push(req.body);
          cake.save().then(
            (cake) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/plain");
              res.json(cake);
            },
            (err) => next(err)
          );
        } else {
          err = new Error("cake " + req.params.cakeId + " not found");
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /Cakes" + req.params.cakeId);
  })
  .delete((req, res, next) => {
    Cakes.findByIdAndDelete(req.params.cakeId)
      .then(
        (cake) => {
          if (cake != null) {
            for (var i = cake.topping.length - 1; i >= 0; i--) {
              cake.topping.id(cake.topping[i]._id).deleteOne();
            }
            cake.save().then(
              (cake) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.json(cake);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("cake " + req.params.cakeId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

cakeRouter
  .route("/:cakeId/toppings/:toppingId")
  .get((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then(
        (Cakes) => {
          if (
            Cakes != null &&
            Cakes.topping.id(req.params.toppingId) != null
          ) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.json(Cakes.topping.id(req.params.toppingId));
          } else if (Cakes == null) {
            err = new Error("cake " + req.params.cakeId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("topping " + req.params.toppingId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then((cake) => {
        if (cake != null && cake.topping.id(req.params.toppingId) != null) {
          if (req.body.rating) {
            cake.topping.id(req.params.toppingId).rating = req.body.rating;
          }
          if (req.body.topping) {
            cake.topping.id(req.params.toppingId).topping = req.body.topping;
          }
          cake.save().then(
            (cake) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/plain");
              res.json(cake);
            },
            (err) => next(err)
          );
        } else if (cake == null) {
          err = new Error("cake " + req.params.cakeId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("topping " + req.params.toppingId + " not found");
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /Cakes" + req.params.cakeId);
  })
  .delete((req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then(
        (cake) => {
          if (cake != null && cake.toppings.id(req.params.toppingId) != null) {
            cake.topping.id(req.params.toppingId).deleteOne();

            cake.save().then(
              (cake) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.json(cake);
              },
              (err) => next(err)
            );
          } else if (cake == null) {
            err = new Error("cake " + req.params.cakeId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("topping " + req.params.toppingId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = cakeRouter;
