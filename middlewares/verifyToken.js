// middleware

// Firebase Admin Configuration
let fireAdmin = require('firebase-admin');

let auth = fireAdmin.auth();
let db = fireAdmin.firestore();

// verifyToken
module.exports =  function verifyToken (sol, res, next)  {

  let clientHeaderToken = sol.headers.token;
  let errors = {}

  if(clientHeaderToken !== undefined ){

    auth.verifyIdToken(clientHeaderToken)
        .then((decodedToken) => {

          sol.loggedUser = decodedToken.uid;

          return db.collection('Users').doc(sol.loggedUser).get()

        })
        .then(user => {
          if(user.exists){
            next();
          } else {

            // por crear un usuario solo con la libreria de firebase
            errors['registredAndCreatedUser'] = false;
            throw Error
          }

        })
        .catch(function(error) {
             errors['tokenExpired'] = true;
             error['accessGranted'] = false;
            res.json({ ...errors , ...error})
        });

  } else {
    res.json({accessGranted: false})
  }

}