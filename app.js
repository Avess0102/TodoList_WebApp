const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

const item1 = new Item({
    name: "Welcome to you todoList."
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this button to delete an item."
});

const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {
    
    
    const day = date.getDate();
    
    Item.find({}, (err, foundItems) => {
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("No Error");
                }
                res.redirect("/");
            })
        } else {
            res.render("list", {listTitle: day, newListItems: foundItems});
        }
        console.log(foundItems);
    })

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
      name: itemName
  });
  item.save();
  res.redirect("/");
  
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, (err)=> {
        if(!err) {
            console.log("Successfully Removed");
        }
    })
    res.redirect("/");
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
