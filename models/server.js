const session = require('express-session');
const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');


class Server {
    constructor() {
        this.app = express();
        //this.conectarBD();
        this.port = process.env.PORT;

        this.middlewares();
        this.routes();
        this.listen();

    }
    //*conectarBD() {
       // this.con = mysql.createPool({
            //host: "localhost",
            //user: "root",
            //password: "elrubiusOMG11",
            //database: "usuariosBD"
        //});

    //}
    middlewares() {
        this.app.use(express.static('./public'));
        this.app.use(express.json());
        this.app.use(express.urlencoded());
        this.app.set('view engine', 'ejs');
        this.app.set('trust proxy');
        this.app.use(session({
            secret:'clave',
            resave: false,
            saveuninitialized: true,
            cookie: {secure:false}
        }));
    }

    routes() {
        this.app.get('/why',(req,res)=>{
        let usuario = req.session.user;
        let rol = req.session.rol;
            if (req.session.user){
                if(req.session.rol =="admin"){
                    res.render('why',{usuario: usuario, rol:rol});
                }
                else if(req.session.rol =="visitante"){
                    res.render('why',{usuario:usuario, rol:rol}); 
                }
            }else{
                res.render('error',{mensaje:'inicia sesion!'});                
            }
        });
        this.app.get('/hola',(req,res)=>{
            if(req.session.user){
                res.send('Hola' + req.session.user);
            } else{
                res.render('error',{mensaje:'inicia sesion!'});
            }
        

        });
        //this.app.get.('consultar',(req,res)=>{

        //});

        this.app.post('/login', (req, res) => {
            let user = req.body.usuario;
            let pass = req.body.cont;

            console.log("Ruta login...");
            console.log(user);
            console.log(pass)

                this.con.query("SELECT * FROM usuarios WHERE usuario='" + user + "'", (err, result, fields) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        if (bcrypt.compareSync(pass, result[0].cont)) {
                            console.log('Credenciales correctas');
                            req.session.user = user;
                            req.session.rol = result[0].rol;
                            res.render("index", { usuario: user, rol: 'admin' });
                        } else {
                            console.log('Contraseña incorrecta');
                            res.render('error', { mensaje: 'Usuario o contraseña incorrecta' });
                        }

                    } else {
                        console.log('Usuario no existe');
                        res.render('error', { mensaje: 'Usuario o contraseña incorrecta' });
                    }

                    //console.log(result);
                });
            });

            //res.send(<h1>credenciales correctas</h1>)
            //res.sendStatus(200);
        this.app.post('/registrar',(req, res) =>{
            let user = req.body.usuario;
            let cont = req.body.cont;
            //Cifrar contraseña
            let salt = bcrypt.genSaltSync(12);
            let hashedCont= bcrypt.hashSync(cont, salt);
            ////////////
            let datos = [user, hashedCont, 'general'];
            let sql = "insert into usuarios values (?,?,?)";
            this.con.query(sql, datos, (err, result) => {
                if(err) throw err;
                console.log("usuario guardado...");
                res.redirect('/login.html');
            });
        });

    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor escuchando: http://127.0.0.1:" + this.port);
        });
    }
}

module.exports = Server;
