// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error Author
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get("/api/zipcodes", (req, res) => {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    db.ZipCode.findAll({
      where: { City: "Charlotte" },
      include: [db.Review]
    }).then(dbZipCode => {
      console.log(dbZipCode)
      res.json(dbZipCode);
    });
  });

  app.get("/api/zipcodes/:id", (req, res) => {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    db.ZipCode.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Review]
    }).then(dbZipCode => {
      res.json(dbZipCode);
    });
  });

  app.post("/api/zipcodes", (req, res) => {
    db.ZipCode.create(req.body).then(dbZipCode => {
      res.json(dbZipCode);
    });
  });

  app.delete("/api/zipcodes/:id", (req, res) => {
    db.ZipCode.destroy({
      where: {
        id: req.params.id
      }
    }).then(dbZipCode => {
      res.json(dbZipCode);
    });
  });

  // GET route for getting all of the Reviews
  app.get("/api/reviews", (req, res) => {
    const query = {};
    if (req.query.zipcode_id) {
      query.ZipCodeId = req.query.zipcode_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.ZipCode
    db.Review.findAll({
      where: query,
      include: [db.ZipCode]
    }).then(dbReview => {
      res.json(dbReview);
    });
  });

  // Get route for retrieving a single Review
  app.get("/api/reviews/:id", (req, res) => {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.ZipCode
    db.Review.findOne({
      where: {
        id: req.params.id
      },
      include: [db.ZipCode]
    }).then(dbReview => {
      res.json(dbReview);
    });
  });
  app.post("/api/reviews", (req, res) => {
    db.Review.create(req.body).then(dbReview => {
      res.json(dbReview);
    });
  });

  app.post("/api/reviews/zip", (req, res) => {
    db.ZipCode.findOne({
      where: {Zip: req.body.zip}
    })
    .then(results=>{
      
      const update = {
        ZipCodeId: results.dataValues.id,
        title: req.body.title,
        body: req.body.body
      }
      db.Review.create(update).then(dbReview => {
        res.json(dbReview);
      });
    })
    // db.Review.create(req.body).then(dbReview => {
    //   res.json(dbReview);
    // });
  });


  // DELETE route for deleting Reviews
  app.delete("/api/reviews/:id", (req, res) => {
    db.Review.destroy({
      where: {
        id: req.params.id
      }
    }).then(dbReview => {
      res.json(dbReview);
    });
  });

  // PUT route for updating Reviews
  app.put("/api/reviews", (req, res) => {
    db.Review.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(dbReview => {
      res.json(dbReview);
    });
  });
  app.get("/api/zipcode/:zip",(req, res) =>{
    db.ZipCode.findOne({where :{zip:req.params.zip}})
    .then(results=>res.json(results))
    .catch(err=> {if(err) throw err})
  })
};
