const express = require("express");
const router = express.Router();

const { users } = require("../data/users.json");

router.use(express.json());

// we don't use /users here bcoz we already have them in index.js.
router.get("/", (req, res) => {
  res.status(200).send({
    status: "success",
    data: users,
  });
});

// to get a specific user using their unique id.
router.get("/:id", (req, res) => {
  const { id } = req.params; // (or)  const id = req.params.id
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).send({
      message: "User NOT FOUND",
    });
  } else {
    return res.status(200).send({
      data: user,
    });
  }
});

// to get the subscription details of a user
router.get("/subscription/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }

    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else if (user.subscriptionType === "Premium") {
      date = date + 365;
    }
    return date;
  };

  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  const data = {
    ...user,
    subscriptionExpired: subscriptionExpiration < currentDate,
    daysLeftForExpiration:
      subscriptionExpiration <= currentDate
        ? 0
        : subscriptionDate - currentDate,
    fine:
      returnDate < currentDate
        ? subscriptionExpiration <= currentDate
          ? 200
          : 100
        : 0,
  };

  res.status(200).json({
    success: true,
    data: data,
  });
});

// to add a new user .
router.post("/", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;
  const user = users.find((each) => each.id === id); // To check whether the new id is already got by another user.
  if (user) {
    return res.status(404).send({
      success: false,
      message: "User already found",
    });
  }
  users.push({ id, name, surname, email, subscriptionType, subscriptionDate });
  return res.status(201).send({
    success: true,
    message: "user created",
    data: users,
  });
});

// To update user details baesd on their ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }
  const updateUser = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    user: updateUser,
  });
});

// TO delete a user based on id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);
  return res.status(200).json({
    success: true,
    data: users,
  });
});

module.exports = router;
