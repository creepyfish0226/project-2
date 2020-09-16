// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/signup.html"));
    res.render("index")
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  // cms route loads cms.html
  app.get("/cms", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/cms.html"));
  });

  // blog route loads members.html
  app.get("/blog", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  // zipcodes route loads zipcode-manager.html
  app.get("/zipcodes", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/zipcode-manager.html"));
  });
};
