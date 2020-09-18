// Requiring path to so we can use relative routes to our HTML files
//const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
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
  app.get("/zipcode/:zip", (req, res) => {
    res.render("map", { zip: req.params.zip });
  });
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.render("members");
  });

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // review route loads review.html
  app.get("/review", isAuthenticated, (req, res) => {
    res.render("review");
  });

  // // zipcodes route loads zipcode-manager.html
  app.get("/zipcodes", isAuthenticated, (req, res) => {
    res.render("zipcode-manager");
  });
};
