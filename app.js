const express = require("express");
const bodyParser = require("body-Parser");
const app = express();
//
app.use(bodyParser.urlencoded({extended:true}));
//
app.set("view engine", "ejs");
app.use(express.static("public"));
var items = [];
app.get("/", function(req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  var day = today.toLocaleDateString("en-US", options);
  res.render("list", {
   day: day,
    newListItem: items
  });
});
app.post("/",function(req,res){
  var item = req.body.newItem;
  items.push(item);
   console.log(item);
   res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});