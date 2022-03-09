const express = require("express");
const { ObjectID } = require("mongodb");
const multer = require("multer");
const Tasks = require("../models/task");
const auth = require("../middleware/auth");
const { query } = require("express");

const router = new express.Router();

// router.get("/task", (req, res) => {
//   res.send("From a new task file");
// });

//video 97 refactoring tasks with async await

router.post("/tasks", auth, async (req, res) => {
  //const tasks = new Tasks(req.body);
  const task = new Tasks({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send();
  }

  // tasks
  //   .save()
  //   .then(() => {
  //     res.status(201).send(tasks);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

//119. Filtering Data  GET /tasks?completed=true
//120. Paginating Data  GET /tasks?limit=2&skip=1
//121. Sorting Data GET /tasks?sortBy=createdAt:decs || asc

router.get("/tasks", auth, async (req, res) => {
  try {
    //const tasks = await Tasks.find({});
    //const task = await Tasks.find({ owner: req.user._id });
    //OR
    const sort = {};
    const match = {};

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");

      console.log(parts); /*THIS IS AN ARRAY*/

      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    res.status(200).send(req.user.tasks);
    console.log(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
  // Tasks.find({})
  //   .then((tasks) => {
  //     res.status(201).send(tasks);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

router.get("/tasks/:id", auth, async (req, res) => {
  //   const _id = new ObjectID();
  //   console.log(_id);

  const _id = req.params.id;
  console.log(_id);
  try {
    //const task = await Tasks.findById(_id);
    const task = await Tasks.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);

    //res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
    // console.log(e);
  }
});

// router.get("/users/:id", async (req, res) => {
//     const _id = req.params.id;

//     try {
//       const user = await User.findById(_id);

//       if (!user) {
//         return res.status(404).send();
//       }

//       res.status(200).send(user);
//     } catch (e) {
//       res.status(500).send(e);
//     }

// Tasks.findById(_id)
//   .then((tasks) => {
//     if (!tasks) {
//       return res.status(404).send();
//     }
//     res.send(tasks);
//   })
//   .catch((error) => {
//     res.status(500).send();
//   });

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["completed", "description"];
  const isValidOperation = updates.every((update) => {
    return allowUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send(`Failure attempt to change ${updates}`);
  }

  try {
    const task = await Tasks.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    //const task = await Tasks.findById(req.params.id);

    // const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!task) {
      return res.status(404).send("Sorry there is no such task!");
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e, "something went wrong");
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Tasks.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(400).send("Sorry no such task");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
