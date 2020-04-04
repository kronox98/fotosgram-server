import { FileUpload } from "../interfaces/fileUploads";
import path from "path";
import fs from "fs";
import uniqid from 'uniqid'
export default class FileSystem {
    constructor() {}

    guardarImagenTemporal( file: FileUpload, userID: string){

        return new Promise( (resolve, reject) => {
            // Crear carpeta directorio
            const path = this.crearCarpetaUsuario( userID );
    
            // Nombre archivo
            const nombreArchivo = this.generarNombre( file.name );
            
            // Mover carpeta del temp a nuestra carpeta
    
            file.mv( `${ path }/${ nombreArchivo }`, (err: any) => {
                if (err) {
                    reject(err);
                }else{
                    // bien
                    resolve();
                }
            });
        })
        
    }

    private generarNombre( nombreOriginal: string ){

        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[ nombreArr.length - 1 ];
        const idUnico = uniqid();        
        return `${ idUnico }.${ extension}`;
    }

    private crearCarpetaUsuario(userID: string){
        const pathUser = path.resolve( __dirname, '../uploads', userID);
        const pathUserTemp = pathUser + '/temp';
        const existe = fs.existsSync(pathUser);
        if ( !existe ) {
            fs.mkdirSync( pathUser);
            fs.mkdirSync( pathUserTemp );
        }
        return pathUserTemp;        
    }

    imagenesDeTempHaciaPost( userID: string ) {
        const pathTemp = path.resolve( __dirname, '../uploads', userID, 'temp');
        const pathPost = path.resolve( __dirname, '../uploads', userID, 'posts');

        if ( !fs.existsSync( pathTemp )) {
            return [];
        }
        if ( !fs.existsSync( pathPost )) {
            fs.mkdirSync( pathPost);
        }

        const imagenesTemp = this.obtenerImagenesTemp( userID );

        imagenesTemp.forEach(imagen => {
            fs.renameSync(`${ pathTemp }/${ imagen }`, `${ pathPost }/${imagen}`)
        });
        return imagenesTemp;
    }

    private obtenerImagenesTemp( userID: string) {
        const pathTemp = path.resolve( __dirname, '../uploads', userID, 'temp');

        return fs.readdirSync(pathTemp) || [];

    }

    getPhotoUrl( userID: string, img: string){

        const pathFoto = path.resolve( __dirname, '../uploads', userID, 'posts', img);

        
        if (!fs.existsSync( pathFoto )) {
            return path.resolve( __dirname, '../assets/original.jpg');
        }


        return pathFoto;

    }
}