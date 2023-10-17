const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
mongoose
  .connect(`mongodb://127.0.0.1/todolist`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoose connection successfull");
  });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const itemSchema = mongoose.Schema({
  item: String,
});

const itemModel = mongoose.model("Item", itemSchema);

app.get("/", (req, res) => {
  const today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const currentDay = today.getDay();
  var day = today.toLocaleDateString("en-US", options);
  const findItems = async function () {
    const itemsDB = await itemModel.find({});
    if (itemsDB.length === 0) {
      const newItem1 = new itemModel({
        item: "Welcome to TodoApp",
      });
      const newItem2 = new itemModel({
        item: "Type and hit + to add new item",
      });

      const newItem3 = new itemModel({
        item: "<< click here to remove an item",
      });

      const items = [newItem1, newItem2, newItem3];

      itemModel.insertMany(items);
      res.redirect("/");
    }
    const list = [];
    itemsDB.forEach((item) => {
      list.push(item);
    });

    res.render("list", { Today: day, listItems: list });
  };
  findItems();
});

app.post("/", (req, res) => {
  var listinput = req.body.textItem;

  itemModel.create({ item: listinput });

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const objectID = req.body.checkbox;
  const removeItem = async function () {
    await itemModel.findByIdAndRemove(objectID);
  };
  removeItem();
  res.redirect("/");
});

const port = 3000;
app.listen(port, () => {
  console.log(`server starten d at : http://localhost:${port}`);
});
