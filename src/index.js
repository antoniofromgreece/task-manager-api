const express = require("express");

require("./db/mongoose");
// const User = require("./models/user");
//const Tasks = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

const port = process.env.PORT;

//108. Express Middleware
//we always have to keep middleware in a seperate file

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disabled");
//   } else {
//     next();
//   }
// });
//challenge
// app.use((req, res, next) => {
//   res.status(503).send("Our site is currently down");
// });

//123. Adding Support for File Uploads

// const multer = require("multer");
// const upload = multer({
//   dest: "images",
// });

// app.post("/upload", upload.single("upload"), (req, res) => {
//   res.send();
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// WE ARE CREATING A NEW ROUTER
// AND WE ARE CUSTOMISING METHODS video 101 check user.js/routers

// const router = new express.Router();
// router.get("/test", (req, res) => {
//   res.send("This is from my other router");
// });
// app.use(router);

//**************************************** */

//********************************************************************** */

app.listen(port, () => {
  console.log(`App is up and running on port ${port}`);
});

// const bcrypt = require("bcryptjs");

// const myFunction = async () => {
//   const password = "Red12345!";
//   const hashedPassword = await bcrypt.hash(password, 8);

//   console.log(password);
//   console.log(hashedPassword);

//   const isMatch = await bcrypt.compare("Red12345!", hashedPassword);
//   console.log(isMatch);
// };

// const jwt = require("jsonwebtoken");

// const myFunction = async () => {
//   const token = jwt.sign({ _id: "abc123" }, "thisismynewcourse", {
//     expiresIn: "7 days",
//   });
//   console.log(token);

//   const data = jwt.verify(token, "thisismynewcourse");
//   console.log(data);
// };

// myFunction();

//112. Hiding Private Data

// const pet = {
//   name: "Hal",
// };

// pet.toJSON = function () {
//   console.log(this);
//   delete pet.name;
//   return this;
// };

// console.log(JSON.stringify(pet));

//114. The User/Task Relationship

// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async () => {
//   // const task = await Task.findById("6214385f007923126c44af6e");
//   // await task.populate("owner").execPopulate();
//   // //console.log(task);
//   // console.log(task.owner);
//   const user = await User.findById("621436cd9c3c2941d8fbb73c");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };
// main();
