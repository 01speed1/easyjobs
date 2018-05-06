let express = require("express");

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

    //profile user info
    profileRouter.route('/:uid')
        .get((sol, res)=>{
          db.collection('Users').doc(sol.params.uid).get()
              .then( user =>{
                  res.json(user.data())
              })
        });
    app.use('/profile',profileRouter);

  //router user
    let userRouter = express.Router();
      userRouter.route('/view/:uid')
          .post((sol, res)=>{
            db.collection('Users').doc(sol.params.uid).get()
                .then( user =>{
                  res.json(user.data())
                })
          });
      userRouter.route('/update/:uid')
          .post((sol, res)=>{

             db.collection('Users').doc(sol.params.uid).update({...data,...sol.body})
                .then((user)=>{
                  res.json({ userUpdated:true, ...user.data()})
                })
                .catch((err)=>{
                  res.json(err)
                })
          });
      userRouter.route('/delete/:uid')
          .post((sol, res)=>{

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
                  res.json({userDeleted: true})
                });
          });
    app.use('/user', userRouter)


};