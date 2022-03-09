const mongoose = require("mongoose");
//const validator = require("validator");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// const User = mongoose.model("User", {
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error("Email is invalid");
//       }
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     minLength: 7,
//     validate(value) {
//       if (value.includes("password")) {
//         throw new Error("password cannot contain password");
//       }
//     },
//   },

//   age: {
//     type: Number,
//     default: 0,
//     validate(value) {
//       if (value < 0) {
//         throw new Error("Age must be positive number!");
//       }
//     },
//   },
// });

// const me = new User({
//   name: "   Antonis   ",
//   email: "antonis@spathis.com",
//   password: "phone123",
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log("Error!", error);
//   });

// const Tasks = mongoose.model("Tasks", {
//   description: {
//     required: true,
//     type: String,
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// });

// const task = new Tasks({
//   description: "   Eat lunch",
// });

// task
//   .save()
//   .then(() => {
//     console.log(task);
//   })
//   .catch((error) => {
//     console.log("Error", error);
//   });
