//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Shanu:sshhaannuu@cluster0.kcent.mongodb.net/TODOLISTDBssl=true", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
// ----------------------------------------------------
const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Welcome to my TO-DO LIST"
});
const item2 = new Item({
  name: "Click on + to add items"
});
const item3 = new Item({
  name: "<-- Check this to remove a task"
});
// ----------------------------------------------------
const listschema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});
const List = mongoose.model("List", listschema);

const defaultTask = [item1, item2, item3];
app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultTask, function(err) {
        if (err)
          console.log(err);
        else
          console.log("Added Successfully");
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItems: foundItems
      });
    }
  });
});
app.get("/:customname", function(req, res) {
  const customname = req.params.customname;
  List.findOne({
    name: customname
  }, function(err, customnamelist) {
    if (!err) {
      if (!customnamelist) {
        const list = new List({
          name: customname,
          items: defaultTask
        });
        list.save(function(err) {
          if (!err) {
            res.redirect('/' + customname);
          }
        });
      } else {
        res.render("list", {
          listTitle: customnamelist.name,
          newListItems: customnamelist.items
        });
      }
    }
  })
});

app.post("/", function(req, res) {
      const itemname = req.body.newItem;
      const listname = req.body.list;
      const dayforpost = date.getDate();
      const item = new Item({
        name: itemname
      });

      if (dayforpost == listname) {
        item.save();
        res.redirect("/");
      } else {
        List.findOne({
          name: listname
        }, function(err, listforpost) {
          listforpost.items.push(item);
          listforpost.save();
          res.redirect("/" + listname);
        });
      }
    });

      app.post("/delete", function(req, res) {
        const itemname = req.body.deleteitem;
        const nameforlist = req.body.listName;
        const daypop = date.getDate();
        if(nameforlist===daypop){
        Item.findByIdAndRemove({
          _id: itemname
        }, function(err) {});
        res.redirect("/");
      }
       else{
         List.findOneAndUpdate({name:nameforlist}, {$pull :{ items:{_id:itemname}}},function(err,foundlist){
           if(!err){
             res.redirect("/" + nameforlist);
           }
         })
       }
      });
      app.listen(process.env.PORT, function() {
        console.log("Server started");
      });
