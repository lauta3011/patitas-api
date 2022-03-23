const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')

if(!fs.existsSync('db/refugio-patitas.db')) {
    fs.writeFileSync('db/refugio-patitas.db', '', (err) => {
        if(err) {
            console.log('aaaaaaaa error creando file ', err);
            return;
        }
        console.log('DB FILE CREATED');
    })
}

const db = new sqlite3.Database('./db/refugio-patitas.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('CONN ERROR',err.message);
    }else {
        db.run('CREATE TABLE Posts (Id INTEGER PRIMARY KEY AUTOINCREMENT, Titulo TEXT NOT NULL, Descripcion TEXT NOT NULL, Imagen TEXT NOT NULL, Tags TEXT NOT NULL)', (err) => {
            if(err) {
                console.log('Error creating table');
            }            
        });

        db.run('CREATE TABLE Productos (Id INTEGER PRIMARY KEY AUTOINCREMENT, Titulo TEXT NOT NULL, Descripcion TEXT NOT NULL, EnStock INTEGER NOT NULL, Imagen TEXT NOT NULL, Tags TEXT NOT NULL, Precio INTEGER NOT NULL, Tipo TEXT NOT NULL)', (err) => {
            if(err) {
                console.log('Error creating table');
            }            
        });
        
        db.run('CREATE TABLE Mascotas (Id INTEGER PRIMARY KEY AUTOINCREMENT, Titulo TEXT NOT NULL, Descripcion TEXT NOT NULL, Imagen TEXT NOT NULL, Tags TEXT NOT NULL, Edad INTEGER NOT NULL, Ubicacion TEXT NOT NULL)', (err) => {
            if(err) {
                console.log('Error creating table');
            }            
        });

        db.run('CREATE TABLE Usuarios (Id INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT NOT NULL, Apellido TEXT NOT NULL, Email TEXT NOT NULL UNIQUE, Descripcion TEXT NOT NULL, Imagen TEXT NOT NULL, Celular INTEGER NOT NULL UNIQUE, Password TEXT NOT NULL)', (err) => {
            if(err) {
                console.log('Error creating table');
            }            
        });

        console.log('Connected to the refugio-patitas database.');
    }
});
  
module.exports = db;