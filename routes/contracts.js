let express = require("express");
let verifyToken = require('../middlewares/verifyToken');  //verifyToken,

module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();

  //router Contracts
  let contractRouter =  express.Router();

  contractRouter.route('/new')
      .post(verifyToken,(sol, res)=>{
        db.collection('Contracts').add({...sol.body})
            .then( contract => db.collection('Contracts').doc(contract.id).get() )
            .then( contract => {res.json({contractCreated:true, contractId:contract.id, ...contract.data()})
            })
            .catch(err => {res.json({contractCreated:false, ...err })})

      })

  contractRouter.route('/all')
      .post(verifyToken,(sol, res)=>{

        db.collection('Contracts').get()
            .then(contracts =>{

              contracts =  contracts.docs.map( c => {
                return { contratId:c.id, ...c.data()}
              })

              res.json({contracts})

            })
            .catch( err => {res.json( err )} )
      });

  contractRouter.route('/view/:sid')
      .post(verifyToken,(sol, res)=>{
        db.collection('Contracts').doc(sol.params.sid).get()
            .then((contract)=>{
              if(contract.exists) {
                res.json( { contractId:contract.id, ...contract.data()} )
              } else {
                res.json( {contractExists: false} )
              }

            })
            .catch((err)=>{
              res.json(err)
            })
      });

  contractRouter.route('/update/:sid')
      .post(verifyToken,(sol, res)=>{
        db.collection('Contracts').doc(sol.params.sid).update({...sol.body})

            .then( ()=> db.collection('Contracts').doc(sol.params.sid).get() )

            .then((contract)=>{
              res.json({contractUpdated:true, contractId: contract.id, ...contract.data()})
            })
            .catch((err)=>{
              res.json(err)
            })
      });

  contractRouter.route('/delete/:sid')
      .post(verifyToken,(sol, res)=>{
        db.collection('Contracts').doc(sol.params.sid).delete()
            .then(()=> {res.json( {contractDeleted:true })})
            .catch(err=> {res.json(err)})
  });
  contractRouter.route('/applicant')
    .post(verifyToken, (sol, res)=>{
      db.collection('Contracts')
        .where('applicantUser', '==', sol.loggedUser.email)
        .get()
        .then( constracts => {
          let Contracts = constracts.docs.map( constract => {
            return constract = {constractId: constract.id, ...constract.data() }
          })
          res.status(201).json({Contracts:Contracts})
        }).catch(err => {
          res-status(400).json({
            firebase_error:err, 
            server_error:"Error al consultar contratos de usuario logeado - applicant"
          })
        })
    })
  
  
  contractRouter.route('/provider')
    .post(verifyToken, (sol, res)=>{
      db.collection('Contracts')
        .where('providerUser', '==', sol.loggedUser.email)
        .get()
        .then( constracts => {
          let Contracts = constracts.docs.map( constract => {
            return constract = {constractId: constract.id, ...constract.data() }
          })
          res.status(201).json({Contracts:Contracts})
        }).catch(err => {
          res-status(400).json({
            firebase_error:err, 
            server_error:"Error al consultar contratos de usuario logeado - provider"
          })
        })
    })
    app.use('/contract', contractRouter)
    
  }