import jwt from 'jsonwebtoken';


export default class Token {
    private static seed: string = 'my-sign-dev';
    private static caducidad: string = '1d';

    constructor() {}

    static getJwtToken( payload: any): string {
        return jwt.sign({
            usuario:payload
        }, this.seed, { expiresIn: this.caducidad });
    }

    static comprobarToken( userToken: string){
        
        return new Promise((resolve, reject) => {

            jwt.verify( userToken, this.seed, ( err, decoded) => {
                if (err) {
                    // Token NO válido
                    reject();
                } else {
                    // Token válido
                    resolve( decoded );
                }
            });

        })

    }
}