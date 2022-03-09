const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");
const router = new express.Router();

// router.get("/users", (req, res) => {
//   res.send("From a new user file");
// });

router.post("/users", async (req, res) => {
  //console.log(req.body);
  //res.send("Testing!");
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
  //OR
  // user
  //   .save()
  //   .then(() => {
  //     res.status(201).send(user);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    //console.log(user);
    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);

  // User.find({})
  //   .then((users) => {
  //     res.status(201).send(users);
  //   })
  //   .catch((error) => {
  //     res.status(500).send();
  //   });
});

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.status(200).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }

// User.findById(_id)
//   .then((users) => {
//     if (!users) {
//       return res.status(404).send();
//     }
//     //console.log(process.argv);
//     //console.log(req.params.id);
//     res.send(users);
//   })
//   .catch((error) => {
//     res.status(500).send();
//   });
// });

// updating an indivitual user by its id

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    ////const user = await User.findById(req.user._id);
    const user = await req.user;

    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // if (!user) {
    //   return res.status(404);
    // }
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.delete("/users/me", auth, async (req, res) => {
//   try {
//     // const user = await User.findByIdAndDelete(req.user._id);

//     // if (!user) {
//     //   return res.status(404).send("User can not be found");
//     // }
//     await req.user.remove();
//     res.status(200).send(req.user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a jpg, jpeg or png"));
    }

    cb(undefined, true);

    //cb(new Error ('file must be a pdf'))
    //cb(undefined, true)
    //cb(undefined,false)
  },
});

//upload.single("avatar") avatar is same name as postman key
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    //127//. Adding Images to User Profile
    //129. Auto-Cropping and Image Formatting
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    //126. Handling Express Errors
    res.status(400).send({ error: error.message });
  }
);

//128. Serving up Files
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

module.exports = router;
