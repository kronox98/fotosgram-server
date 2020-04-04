import { Router, Response } from "express";
import { verficarToken } from "../middlewares/autenticacion";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/fileUploads";
import FileSystem from "../classes/file-system";


const postRoutes = Router();
const fileSystem = new FileSystem

// Obtener Post Paginas
postRoutes.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const post = await Post.find()
                           .sort({ _id: -1})
                           .skip(skip)
                           .limit(10)
                           .populate('usuario', '-password')
                           .exec();

    res.json({
        ok: true,
        pagina: pagina,
        post
    })


})

// Crear post
postRoutes.post('/', [ verficarToken ], (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempHaciaPost( req.usuario._id );

    body.imgs = imagenes;

    Post.create( body ).then( async postDb => {

        await postDb.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            post: postDb
        });
    })
    .catch( err => {
        res.json( err )
    });
});

// Subir archivo
postRoutes.post('/upload', [ verficarToken ], async (req: any, res: Response) =>{
    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        })
    }

    const file: FileUpload = req.files.image;
    if ( !file ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        })
    }
    
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No es una imagen'
        });        
    }

    await fileSystem.guardarImagenTemporal( file, req.usuario._id );
    

    res.json({
        ok: true,
        file: file.mimetype
    })
});

// postRoutes.get('/imagen/:userid/:img', [verficarToken], (req: any, res: Response) => {
postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {
    const userID = req.params.userid;
    const img = req.params.img;

    const pathPhoto = fileSystem.getPhotoUrl( userID, img);

    res.sendFile( pathPhoto );


})









export  default postRoutes;