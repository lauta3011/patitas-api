const express = require("express");
const app = express();
const cors = require("cors");
const db = require("../db/database.js");

const HTTP_PORT = process.env.PORT || 8000; 

const bodyParser = require("body-parser");

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage }).single('file');

// app.use(upload); 
app.use(cors());

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: true })
 
app.listen(HTTP_PORT, () => {
    console.log("Listening in ", HTTP_PORT);
});

///////get methods//////
app.get("/", (req, res) => {
    res.json({ message:"Ok" });
});

app.get("/get_posts", cors(), (req, res) => {    
    db.all("SELECT Titulo, Descripcion FROM Posts", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }

        res.json({
            "message":"success",
            "data":rows
        })
    });
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

app.get("/get_users", jsonParser, (req, res) => {    
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

app.get("/get_spec_data", jsonParser, (req, res) => {
    const search = JSON.parse(req.query.search);
    let query = "SELECT * FROM " + search.type;

    if(search.title !== "" && search.title !== " ") {
        query += " WHERE Titulo = " + search.title
    }

//  TANGO QUE TERMINAR DE IMPLEMENTAR EL FILTRADO DE BUSQUEDA DE LOS DATOS
//  FALTA BUSCARLO POR TITULO QUE CONTENGA PALABRAS CLAVE Y TAGS


    db.serialize(() => {
        db.all(query, [], (err, rows) => {
            if (err) {
                res.status(400).json({"error":err.message});
                return;
              }
  
              res.json({
                  "message":"success",
                  "data":rows
              })    
        })
    })
})

////////////////////    IMPLEMENTAR EL DELETE /////////////////


/////post methods///////
app.post("/post_posts/", jsonParser, (req, res) => {
    const data = {
        title : req.body.title,
        description : req.body.description,
        thumbnail : req.body.thumbnail,
        tag : req.body.tag
    }
    const params = [data.title, data.description, data.thumbnail, data.tag];

    db.run("INSERT INTO Posts (Titulo, Descripcion, Imagen, Tags) VALUES (?,?,?,?)", params, (err) => {
        if(err) {
            console.log("ERROR IN INSERT",err);
            res.json({ status: 500 });
            return;
        }

        res.json({ status: 200 });
    })
})

app.post("/post_pet/", jsonParser, (req, res) => {
    console.log(req.body)
    const data = {
        name : req.body.name,
        thumbnail : req.body.thumbnail,
        description : req.body.description,
        age : req.body.age,
        location : req.body.location,
        tag : req.body.tag
    }
    const params = [data.name, data.description, data.age, data.location, data.thumbnail, data.tag];

    db.run("INSERT INTO Mascotas (Titulo, Descripcion, Edad, Ubicacion, Imagen, Tags) VALUES (?,?,?,?,?,?)", params, (err) => {
        if(err) {
            console.log("ERROR IN INSERT",err);
            res.json({ status: 500 });
            return;
        }

        res.json({ status: 200 });
    })
})

app.post("/post_product/", jsonParser, (req, res) => {
    console.log(req.body)
    const data = {
        title : req.body.title,
        type: req.body.type,
        thumbnail : req.body.thumbnail,
        description : req.body.description,
        price : req.body.price,
        tag : req.body.tag
    }

    const params = [data.title, data.type, data.description, data.price, data.thumbnail, data.tag];

    db.run("INSERT INTO Productos (Titulo, Tipo, Descripcion, Precio, Imagen, Tags) VALUES (?,?,?,?,?,?)", params, (err) => {
        if(err) {
            console.log("ERROR IN INSERT",err);
            res.json({ status: 500 });
            return;
        }

        res.json({ status: 200 });
    })
})

app.post("/upload_image/", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.json({ status: 500 });
            return
        }
      });
    res.json({ status: 200 });
})

app.use(express.static('public'));

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});