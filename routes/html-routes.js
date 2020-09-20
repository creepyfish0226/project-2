// Requiring path to so we can use relative routes to our HTML files
//const path = require("path");
const db = require("../models");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("signup");
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("login");
  });

  // Get rout to test map
  app.get("/zipcode/:zip", (req, res) => {
    res.render("map", { zip: req.params.zip });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    db.Review.findAll({ include: [db.ZipCode] }).then(dbReview => {
      // console.log(dbReview);
      if (dbReview.length) {
        res.render("members", {
          review: dbReview,
          Zip: [{ zip: req.params.zip }]
        });
      } else {
        res.render("members", {
          nothing: { nothing: true },
          Zip: [{ zip: req.params.zip }]
        });
      }
    });
  });

  // review route loads review.html
  app.get("/review", isAuthenticated, (req, res) => {
    res.render("review");
  });

  // zipcodes route loads zipcode-manager.html
  app.get("/zipcodes", isAuthenticated, (req, res) => {
    res.render("zipcode-manager");
  });

  //Get  rout to get all the reviews for a single zipcode
  app.get("/zipcodes/:zip", isAuthenticated, (req, res) => {
    db.ZipCode.findOne({ where: { Zip: req.params.zip } }).then(results => {
      if (results) {
        db.Review.findAll({
          where: { ZipCodeId: results.dataValues.id },
          include: [db.ZipCode]
        }).then(dbReview => {
          if (dbReview.length) {
            res.render("zipcode-reviews", {
              review: dbReview,
              Zip: [{ zip: req.params.zip }]
            });
          } else {
            res.render("zipcode-reviews", {
              nothing: { nothing: true },
              Zip: [{ zip: req.params.zip }]
            });
          }
        });
      } else {
        res.render("zipcode-reviews", {
          none: { nothing: true },
          Zip: req.params.zip
        });
      }
    });
  });

  //Get  rout to get all the reviews for a single user
  app.get("/user", isAuthenticated, (req, res) => {
    db.Review.findAll({
      where: {
        UserId: req.user.id
      },
      include: [db.ZipCode]
    }).then(dbReview => {
      if (dbReview.length) {
        res.render("user-reviews", {
          review: dbReview,
          Zip: [{ zip: req.params.zip }]
        });
      } else {
        res.render("user-reviews", {
          nothing: { nothing: true },
          Zip: [{ zip: req.params.zip }]
        });
      }
    });
  });
};
