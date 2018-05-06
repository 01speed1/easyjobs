// middleware

// Firebase Admin Configuration
let fireAdmin = require('firebase-admin');

let auth = fireAdmin.auth();

// verifyToken
module.exports =  function verifyToken (sol, res, next)  {

  let clientHeaderToken = sol.headers.authtoken;

  if(clientHeaderToken !== undefined ){

    auth.verifyIdToken(clientHeaderToken)
        .then((decodedToken) => {



          res.json(decodedToken.uid)


        }).catch(function(error) {

      res.json(error.tokenExpired = true)
    });

    next()

  } else {
    res.json({accessGranted: false})
  }

}