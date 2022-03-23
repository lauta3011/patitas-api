const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const fs = require('fs')

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
    db.all("SELECT Titulo, Descripcion, Imagen FROM Posts", [], (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }

        res.json({
            "status":200,
            "data":rows
        });
});
});

app.get("/get_products", (req, res) => {    
    db.serialize(() => {
        db.all("SELECT Titulo, Descripcion, Imagen, Precio FROM Productos", [], (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }

            res.json({
                "status":200,
                "data":rows
            });
        });
    })
});

app.get("/get_pets", (req, res) => {    
    db.serialize(() => {
        db.all("SELECT Titulo, Descripcion, Edad, Imagen FROM Mascotas", [], (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }

            res.json({
                "status":200,
                "data":rows
            });
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
                "status":200,
                "data":rows
            });
        });
    })
});

app.get("/login", jsonParser, (req, res) => {
    const auth = JSON.parse(req.query.auth);

    db.get("SELECT * FROM Usuarios WHERE Email = '"+ auth.user +"' AND Password = '"+ auth.pass +"'", (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});  
            return;
        }

        if(row) {
            let user = {
                name: row.Nombre + " " + row.Apellido,
                thumbnail: row.Imagen,
                phone: row.Celular,
                description: row.Descripcion,
                isAdmin: row.isAdmin
            }
    
            res.json({
                "status":200,
                "data":user
            });    
            return;    
        } else {
            if (auth.user === "admin@refugio-patitas.com" && auth.pass === "admin") {
                let admin = {
                    isAdmin : 1
                };
    
                res.json({
                    "status":200,
                    "data":admin
                }); 

                return;
            }else {
                res.json({
                    "status":400,
                    "data":"El usuario no existe"
                });        
                return;
            }
        } 
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
app.post("/add_user", jsonParser, (req, res) => {
    const data = req.body;
    const params = [data.name, data.lastName, data.description, data.mail, data.pass, data.phone, data.thumbnail];

    db.run("INSERT INTO Usuarios (Nombre, Apellido, Descripcion, Email, Password, Celular, Imagen) VALUES (?, ?, ?, ?, ?, ?, ?)", params, (err) => {
        if(err) {
            console.log("ERROR IN INSERT",err);
            res.json({ status: 500 });
            return;
        }
    })

    res.json({ status: 200 });
})

app.post("/post_posts/", jsonParser, (req, res) => {
    const data = req.body;
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
    const data = req.body;
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
    const data = req.body;
    const params = [data.title, data.type, data.description, data.price, data.thumbnail,1, data.tag];

    db.run("INSERT INTO Productos (Titulo, Tipo, Descripcion, Precio, Imagen, EnStock, Tags) VALUES (?,?,?,?,?,?,?)", params, (err) => {
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

////////////put methods//////////////
app.put("/modify_data", jsonParser, (req, res) => {
    const data = req.body.data;
    let query = "UPDATE " + data.dataType + " SET Titulo =?, Descripcion=?, ";
    let params;

    if(data.dataType === "Productos") {
        query += " Precio=?, EnStock=? ";
        params = [data.title, data.description, data.price, data.inStock, data.id]
    }else if(data.dataType === "Mascotas") {
        query += " Edad=?, Ubicacion=? ";
        params = [data.title, data.description, data.age, data.location, data.id]
    }
    query += "WHERE Id = ?";
    
    console.log(query)
    console.log(params)
   
    db.run(query, params, (err) => {
        if(err) {
            console.log("ERROR IN UPDATE", err);
            res.json({ status: 500 });
            return;
        }

        res.json({ status: 200 });
    })
})

///////////delete methods//////////////
app.delete("/delete_data", jsonParser, (req, res) => {
    const data = req.body;
    const imagePath = "./public/"+data.thumbnail;
    const query = "DELETE FROM " + data.type + " WHERE Id = ?";
    
    fs.unlinkSync(imagePath);

    db.run(query, [data.id], (err) => {
        if(err) {
          console.log("ERROR IN DELETE ", err);
          res.json({ status: 500 });
          return;
        };

        res.json({ status: 200 });
    });
})

app.use(express.static('public'));

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});