const jwt = require('jsonwebtoken');

// Verificar el token

const verificaToken = ( req, res, next ) => {

    let token = req.get('auth');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario;
        
        next();

    });


};

const verificaUserRole = (req, res, next) => {

    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

};

//============
// Verifica token img
//============


const verificaTokenImg = ( req, res, next ) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario;
        
        next();

    });


};


module.exports = {
    verificaToken,
    verificaUserRole,
    verificaTokenImg
};