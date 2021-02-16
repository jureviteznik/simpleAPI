var express = require('Express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//DATABASE INIT
var articleDB = new Object();
popoulateDB();

/////////
// API //
/////////

//GET ALL - returns everything thats in the database
app.get("/", function(req, res){
    res.send(getAllArticles());
 });


//GET article
app.get("/:id([0-9]+)", function(req, res){
    if(checkDB(req.params.id)){
        res.send(getArticle(req.params.id));
    }else{
        res.send("article with id:" + req.params.id + " does not exist!");
    }
 });

//POST article
 app.post("/", function(req, res) {
    //check body data
    if(!req.body.id.toString().match(/^[0-9]+$/g) || !req.body.name || !req.body.quantity.toString().match(/^[0-9]+$/g)){
        res.status(400);
        res.json({message: "Bad Request"});
    //check if id exists
    }else if(checkDB(req.body.id)){
            res.status(409);
            res.send("article with id "+ req.body.id + " already exists!");
    //add new entry to db
    }else{
        addArticle(req.body.id, req.body.name, req.body.quantity);
        res.send("Added a new article with id:" + req.body.id + " and name:" + req.body.name);
    }
});

//PUT article
app.put("/:id([0-9])", function(req, res){
    //check if id exists
    if(!checkDB(req.params.id)){
        res.status(409);
        res.send("article with id:" + req.params.id + " does not exist!");
    
    }else{
        //update name if its requested
        if(req.body.name){
            updateArticle(req.params.id, "name", req.body.name);
        }
        //update quantity if its requested
        if(req.body.quantity){
            updateArticle(req.params.id, "quantity", req.body.quantity);
        }
        res.send("Updated aticle with id:" + req.params.id);
    }
});

//DELETE article
app.delete("/:id([0-9])", function(req, res){
    //check if id exists
    if(!checkDB(req.params.id)){
        res.status(409);
        res.send("article with id "+ req.params.id + " does not exists!");
    }else{
        deleteArticle(req.params.id);
        res.send("article with id "+ req.params.id + " has been deleted!");
    }
});



//UNKNOWN PATH
app.get('*', function(req, res){
    res.status(400);
    res.send('Sorry, this is an invalid URL.');
 });


app.listen(3000);

////////////////////////
// DATABASE FUNCTIONS //
////////////////////////

//DB init
function popoulateDB(){
    articleDB[0] = {name : "miza", quantity: 5};
    articleDB[1] = {name : "okno", quantity:3};
    articleDB[2] = {name : "zavese", quantity:13};
    articleDB[3] = {name : "copati", quantity:6};
}

function getAllArticles(){
    return articleDB;
}

function getArticle(id){
    return articleDB[id];
}

function addArticle(id, name_, quantity_){
    articleDB[id] = {name: name_, quantity: quantity_};
}

function checkDB(id){
    return id in articleDB;
}

function updateArticle(id, key, value){
    articleDB[id][key] = value;
}

function deleteArticle(id){
    delete articleDB[id];
}