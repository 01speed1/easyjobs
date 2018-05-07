// middleware

// Firebase Admin Configuration
let fireAdmin = require('firebase-admin');

let auth = fireAdmin.auth();

// verifyToken
module.exports =  function verifyToken (sol, res, next)  {

  let clientHeaderToken = sol.headers.token;

  if(clientHeaderToken !== undefined ){

    auth.verifyIdToken(clientHeaderToken)
        .then((decodedToken) => {
          console.log('valid token (y)')
          sol.loggedUser = decodedToken.uid;
          next();

        }).catch(function(error) {
             error['tokenExpired'] = true;

            res.json({accessGranted:false, ...error})
        });

  } else {
    res.json({accessGranted: false})
  }

}