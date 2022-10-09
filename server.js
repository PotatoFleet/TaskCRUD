const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

require("dotenv").config();

mongoose.connect(process.env.DB_URL || "mongodb://localhost/mongodb");

const Task = require("./Task");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/create", (req, res) => {
  try {
    new Task({
      name: req.body.name,
      done: req.body.done,
      deadline: req.body.deadline,
    }).save();
  } catch (err) {
    console.log(err);
  }
  res.sendStatus(200);
});

app.get("/read", async (_req, res) => {
  const tasks = await Task.find({});
  res.send({ tasks: tasks });
});

app.put("/update", async (req, res) => {
  try {
    await Task.updateOne(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          done: req.body.done,
          deadline: req.body.deadline,
        },
      }
    );
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.delete("/del", async (req, res) => {
  try {
    await Task.deleteOne({ id: req.body.id });
    res.send({ successful: true, message: "Successfully deleted task" });
  } catch (err) {
    res.send({ successful: false, message: err });
  }
});

app.listen(PORT, () => {
  console.log(`Litening on Port ${PORT}`);
});
