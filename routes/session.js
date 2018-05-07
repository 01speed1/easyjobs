let express = require("express");




module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();
  // Auth validator
  let auth = fireAdmin.auth();

  // router login
  let loginRouter = express.Router();
  loginRouter.route('/')
      .get((sol, res)=>{
        res.redirect('/log.html')
      })
      .post((sol, res)=>{

        let data = {}

        auth.getUserByEmail(sol.body.email)
            .then( user =>  db.collection('Users').doc(user.uid).get() )
            .then( user => {
                if(user.exists){
                  let userInfo = {uid:user.id, ...user.data()};

                  data.userInfo = userInfo;

                  if (userInfo.password === sol.body.password) {

                    delete data.userInfo.password

                    return auth.createCustomToken(user.id)

                  } else {
                   res.json({
                     accessGranted:false,
                     message:"Wrong password"
                   });
                  }
                }
            } )
            .then( token => {
                if (token) {
                  // data.token = token
                  res.json(data)
                }


            } )
            .catch( err => res.json(err))


      });
  app.use('/login',loginRouter);


  // router register
  let signUpRouter = express.Router();
  signUpRouter.route('/')
      .get((sol, res)=>{
        res.redirect('/register.html')
      })
      // registra, guarda info en la base de datos y envia token
      .post((sol, res)=>{

        let data = {}

        auth.createUser({...sol.body})
            .then(newUser =>{
              // delete sol.body.password
              data.uid = newUser.uid
              return db.collection('Users').doc(newUser.uid).set({...sol.body}, {merge:true});

            })
            .then( () =>  db.collection('Users').doc(data.uid).get() )
            .then(user => {
              if (user.exists) {

                // ya no sera nesesario este id
                delete data.uid

                data = {
                  userRegistred:true,
                  userCreated: true,
                  userInfo: {uid:user.id, ...user.data()}
                }
                // borra la constraseña a la hora de enviar al  cliente
                delete data.userInfo.password

                return true


              } else {
                res.json({userExists:false})
              }


            })
            .then( token => {

              res.json( data )
            })
            .catch((err)=>{
              res.json(err)
            })


      })
  app.use('/signup',signUpRouter);



};


