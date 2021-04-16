const express = require("express");
const router = express.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
const passport = require("../config/passport");
const config = require("../config/config");
const { User, Stock, Draw, UserStocks } = require("../models/");

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Draw,
          as: "draws",
          attributes: ["createdAt", "pickedStock"],
        },
        {
          model: Stock,
          as: "stocks",
          attributes: ["symbol", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    res.json(users);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//signup
router.post("/signup", async (req, res) => {
  console.log(req.body);
  if (req.body.email && req.body.password) {
    req.body.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      const user = await User.create(req.body) 
        // if (error) res.status(401).json(error);
        // if (createdUser) {
          let payload = {
            id: user.id,
          };
          console.log(payload);
          let token = jwt.encode(payload, config.jwtSecret);
          console.log(token);
          res.json({
            token: token,
            id: user.id, // CHECK IF ._id but maybe that's just mongo
          })
        // } else {
        //   console.log("failed to create user");
        //   res.status(401).json(error);
        // }
      
    } else {
      console.log("user exists, try logging in"); //note update this
      res.status(401).json(error);
    }
  } else {
      res.status(401).json(error)
  }

  
});

//login
router.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    console.log(req.body.email);
    const user = await User.findOne({
        where: {
            email: req.body.email
        },
    })
    if (!user) {
        console.log('user doesnt exist - try signing up')
        res.status(401).json(error)
    } else {
        console.log('checking password')
        if (bcrypt.compareSync(req.body.password, user.password)) {
            console.log('pw correct, generating JWT')
            let payload = {
                id: user.id,
                email: user.email,
              };
              let token = jwt.encode(payload, config.jwtSecret);
              console.log(token);
              res.json({
                token: token,
                id: user.id, //OR _.id, same deal as signup
              });
            } else {
              console.log("Wrong password");
              res.status(401).json(error);
            }

        }
    } else {
        res.status(401).json(error)
    }







//     User.findOne({ email: req.body.email }, (error, user) => {
//       if (error) res.status(401).json(error);
//       if (user) {
//         console.log("Found user. Checking password...");
//         if (bcrypt.compareSync(req.body.password, user.password)) {
//           console.log("Password correct, generating JWT...");
//           let payload = {
//             id: user.id,
//             email: user.email,
//           };
//           let token = jwt.encode(payload, config.jwtSecret);
//           console.log(token);
//           res.json({
//             token: token,
//             id: user.id, //OR _.id, same deal as signup
//           });
//         } else {
//           console.log("Wrong password");
//           res.status(401).json(error);
//         }
//       } else {
//         console.log("Couldn't find user. Try signing up.");
//         res.status(401).json(error);
//       }
//     });
//   } else {
//     res.status(401).json(error);
//   }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Draw,
          as: "draws",
          attributes: ["createdAt", "pickedStock"],
        },
        {
          model: Stock,
          as: "stocks",
          attributes: ["symbol", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    res.status(200).json(user);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//create new user
// router.post("/", async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.json(user);
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

router.post("/:id", async (req, res) => {
  try {
    if (req.body.action === "createDraw") {
      try {
        res.json("createDraw for id " + req.params.id);
      } catch (error) {
        res.json({ error: error.message });
      }
    } else if (req.body.action === "createStock") {
      try {
        res.json("createStock for id " + req.params.id);
      } catch (error) {
        res.json({ error: error.message });
      }
    } else {
      res.json("action not recognized");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
  // try {
  //BIG NOTE YOU MIGHT BE MOVING THIS TO DRAWS and /draws/:id
  //or maybe users/:id/draws
  // get personal user stock list

  /* make a call to alphavantage for each stock in stock list to get whatever numbers youll use for sentiment analysis
        these should be objects so you can rank by whatever criteria (SMA, for example)
        */

  /* tarot reading. This is going to return back:
        each rank and reverse, the sentiment number (note - should you analyze sent afterewards?) and in 1.1, a random saying from each card. I think tarem has a version of this*/

  /*
        we'll create a new entry in draws and res.json some of that info to the front end. from draws:
            firstRank and R
            secondRank and R
            thirdRank and R
            pickedStock and R

        of course, we have to figure out the pickedStock string and maybe think about adding the sentiment to the draws, possibly.

        */

  // const userStock = await UserStocks.create({
  //     userId: req.params.id,
  //     stockId: req.body.stockId
  // })
  // res.json(userStock)
  // } catch (error) {
  //     res.json({error: error.message})
  // }
});

module.exports = router;
