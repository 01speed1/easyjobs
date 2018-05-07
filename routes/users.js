let express = require("express");

//middlewares
let verifyToken = require('../middlewares/verifyToken');  //verifyToken

module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();
  // Auth validator
  let auth = fireAdmin.auth();

  //router profile
    let profileRouter = express.Router();

    // user router
    profileRouter.route('/')
        .get((sol, res)=>{
          res.redirect('/profile.html')
        })

  //logged profile
  profileRouter.route('/')
      .post(verifyToken,(sol, res)=>{
        db.doc('Users/'+sol.loggedUser).get()
            .then( user =>{
              if  (user.exists) {
                let userInfo = {uid:user.id, ...user.data()}
                delete userInfo.password;
                res.json(userInfo)
              } else { res.send(" si ve esto mrk ust hizo un mierdero ")}

            })
      });
    //profile user info
    profileRouter.route('/:uid')
        .post(verifyToken,(sol, res)=>{
          if (sol.params.uid !== "me"){
            db.collection('Users').doc(sol.params.uid).get()
                .then( user =>{
                  let userInfo = { ...user.data()}
                  delete userInfo.password;

                  res.json(userInfo)
                })
          }

        });
    app.use('/profile',profileRouter);

  //router user
    let userRouter = express.Router();
      userRouter.route('/view/:uid')
          .post(verifyToken,(sol, res)=>{
            db.collection('Users').doc(sol.params.uid).get()
                .then( user =>{
                  let userInfo = {...user.data()}
                  delete userInfo.password;
                  res.json({uid:user.id, ...userInfo})
                })
          });
      userRouter.route('/update/:uid')
          .post(verifyToken,(sol, res)=>{

             db.collection('Users').doc(sol.params.uid).update({...sol.body})
                 .then(()=> db.collection('Users').doc(sol.params.uid).get())
                 .then((user)=>{
                   let userInfo = {...user.data()}
                   delete userInfo.password;
                    res.json({ userUpdated:true, ...userInfo})
                  })
                  .catch((err)=>{
                    res.json(err)
                  })
          });
      userRouter.route('/delete/:uid')
          .post(verifyToken,(sol, res)=>{

            let locals = {};

            auth.deleteUser(sol.params.uid)
                .then(() => {
                  console.log("Borrando credenciales...");
                  locals.userCredentialsDeleted =  true;

                  return db.collection('Users').doc(sol.params.uid).delete();
                })
                .then(() => {
                  console.log("Borrando perfil de usuario...");
                  locals.userInfoDeleted = true;
                  res.json(locals);
                })
                .catch(function(error) {
                  locals.userDeleted = true;
                  res.json({...locals, ...error})
                });
          });
    app.use('/user', userRouter)


};