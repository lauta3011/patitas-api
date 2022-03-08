const express = require("express");
const app = express();
const cors = require("cors");
const db = require("../db/database.js");
const bodyParser = require("body-parser");

const HTTP_PORT = process.env.PORT || 8000; 

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
    console.log("Listening in ", HTTP_PORT);
});

///////get methods//////
app.get("/", (req, res) => {
    res.json({ message:"Ok" });
});

app.get("/get_posts", cors(), (req, res) => {    
    db.serialize(() => {
        db.each("SELECT Titulo, Descripcion FROM Posts", [], (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }

            res.json({
                "message":"success",
                "data":rows
            })
        });
    })
});

app.get("/get_products", (req, res) => {    
    db.serialize(() => {
        db.each("SELECT Titulo, Descripcion FROM Productos", [], (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }

            res.json({
                "message":"success",
                "data":rows
            })
        });
    })
});

app.get("/get_users", (req, res) => {    
    db.serialize(() => {
        db.all("SELECT Email, Nombre FROM Usuarios", [], (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }

            res.json({
                "message":"success",
                "data":rows
            })
        });
    })
});

/////post methods///////
app.post("/post_posts/", (req, res) => {
    const data = {
        title : req.query.title,
        description : req.query.description,
        image : req.query.image,
        tags : req.query.tags
    }
    
    let params = [data.title, data.description, data.image, data.tags];
    db.run("INSERT INTO Posts (Titulo, Descripcion, Imagen, Tags) VALUES (?,?,?,?)", params, (err) => {
        if(err) {
            console.log("ERROR IN INSERT",err);
            res.json({ message:"error", data : err });
            return;
        }

        res.json({ message:"success", data : data });
    })
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});