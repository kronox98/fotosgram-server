import { Router, Request, Response, request } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";

const userRoutes = Router();

// ruta de Prueba
userRoutes.get('/prueba', ( req: Request, res: Response ) => {
    res.json({
        ok: true,
        mensaje: 'Todo funciona bien'
    })
});

// Login

userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, ( err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectas'
            })
        }

        if (userDB.compararPassword( body.password )) {

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            }) 
            return res.json({
                ok: true,
                token: tokenUser
            })
        }else{
            return res.json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectas ***'
            });
        }


    })
});


// Crear
userRoutes.post('/create', (req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }
    Usuario.create( user)
        .then( userDB => {
            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            }) 
            res.json({
                ok: true,
                token: tokenUser
            })
        }).catch( err => {
            res.json({
                ok: false,
                mensaje: 'Algo salió mal',
                err
            })
        });
});



export default userRoutes;