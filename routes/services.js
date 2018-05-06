let express = require("express");

module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();

  // Auth validator
  let auth = fireAdmin.auth();

  //router Servicies
  let serviceRouter =  express.Router();

    serviceRouter.route('/new')
        .post((sol, res)=>{
          db.collection('Services')
              .add({...sol.body})
              .then(service => db.collection('Services').doc(service.id).get())
              .then(service => {res.json( {serviceId:service.id, ...service.data()}  )})
              .catch(err => {res.json(err)})
        });

    serviceRouter.route('/view/:sid')
        .post((sol, res)=>{
          db.collection('Services').doc(sol.params.sid).get()
              .then((service)=>{
                res.json(service.data())
              })
              .catch((err)=>{
                res.json(err)
              })
        });

    serviceRouter.route('/update/:sid')
        .post((sol, res)=>{
          db.collection('Services').doc(sol.params.sid).update({...sol.body})

              .then(()=> db.collection('Services').doc(sol.params.sid).get())

              .then((service)=>{
                res.json({serviceUpdated:true, ...service.data()})
              })
              .catch((err)=>{
                res.json(err)
              })
        })

    serviceRouter.route('/delete/:sid')
        .post((sol, res)=>{
          db.collection('Services').doc(sol.params.sid).delete()
              .catch(err=> {res.json(err)})
        })

  app.use('/service', serviceRouter)



}