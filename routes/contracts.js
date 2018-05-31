let express = require("express");

module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();

  //router Contracts
  let contractRouter =  express.Router();

  contractRouter.route('/new')
      .post((sol, res)=>{
        db.collection('Contracts').add({...sol.body})
            .then( contract => db.collection('Contracts').doc(contract.id).get() )
            .then( contract => {res.json({contractCreated:true, contractId:contract.id, ...contract.data()})
            })
            .catch(err => {res.json({contractCreated:false, ...err })})

      })

  contractRouter.route('/all')
      .post((sol, res)=>{

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
      .post((sol, res)=>{
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
      .post((sol, res)=>{
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
      .post((sol, res)=>{
        db.collection('Contracts').doc(sol.params.sid).delete()
            .then(()=> {res.json( {contractDeleted:true })})
            .catch(err=> {res.json(err)})
      });

  app.use('/contract', contractRouter)

}