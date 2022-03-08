const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/refugio-patitas.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('CONN ERROR',err.message);
    }else {
        db.run('CREATE TABLE Posts (Id integer PRIMARY KEY AUTOINCREMENT, Titulo text NOT NULL, Descripcion text NOT NULL, Imagen text NOT NULL, Tags text NOT NULL)', (err) => {
            if(err) {
                console.log('Table already exists');
            }            
        });

        db.run('CREATE TABLE Productos (Id integer PRIMARY KEY AUTOINCREMENT, Producto text NOT NULL, Descripcion text NOT NULL, Imagen text NOT NULL, Tags text NOT NULL)', (err) => {
            if(err) {
                console.log('Table already exists');
            }            
        });
        
        db.run('CREATE TABLE Mascotas (Id integer PRIMARY KEY AUTOINCREMENT, Mascota text NOT NULL, Descripcion text NOT NULL, Imagen text NOT NULL, Tags text NOT NULL)', (err) => {
            if(err) {
                console.log('Table already exists');
            }            
        });
        
        db.run('CREATE TABLE Usuarios (Id integer PRIMARY KEY AUTOINCREMENT, Email text NOT NULL UNIQUE, Password text NOT NULL, Imagen text, Descripcion text)', (err) => {
            if(err) {
                console.log('Table already exists');
            }            
        });
        
        console.log('Connected to the refugio-patitas database.');
    }
});
  
module.exports = db;