import mongoose from "mongoose";
import bodyParser from 'body-parser';
import fileupload from 'express-fileupload';
import Server from "./classes/server";
import userRoutes from "./routes/usuario";
import postRoutes from "./routes/post";

const server = new Server();

// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

// File Upload
server.app.use( fileupload() );
// server.app.use( fileupload({ useTempFiles: true }) );


// Rutas de la aplicación
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

// Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram',{
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false
}, (err => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
    
})

)

// Levantar express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);    
});