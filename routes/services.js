let express = require("express");

//middlewares
let verifyToken = require('../middlewares/verifyToken');  //verifyToken,

module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();

  //router Servicies
  let serviceRouter =  express.Router();

    serviceRouter.route('/new')
        .post(verifyToken, (sol, res)=>{
          db.collection('Services')
              .add({...sol.body})
              .then(service => db.collection('Services').doc(service.id).get())
              .then(service => {res.json( {serviceId:service.id, ...service.data()}  )})
              .catch(err => {res.json(err)})
        });

    serviceRouter.route('/view/all')
        .post(verifyToken,(sol, res)=>{
          db.collection('Services').get()
          .then( servives => {
            let array_services = []
            servives.forEach(service => array_services.push({serviceId:service.id, ...service.data()}))
            res.status(201).json({servives:array_services})
          })
          .catch( err => res.status(500).json({server_error: "fallo la consulta de los servicios", err}) )
        })

    serviceRouter.route('/view/:sid')
        .post(verifyToken,(sol, res)=>{
          db.collection('Services').doc(sol.params.sid).get()
              .then((service)=>{
                if (service.exists) {
                  res.json( {serviceId:service.id, ...service.data()}  )
                } else {
                  res.json( {serviceExists: false} )
                }

              })
              .catch((err)=>{
                res.json(err)
              })
        });

    serviceRouter.route('/update/:sid')
        .post(verifyToken,(sol, res)=>{
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
        .post(verifyToken,(sol, res)=>{
          db.collection('Services').doc(sol.params.sid).delete()
              .then(()=> {res.json( {serviceDeleted: true  } )})
              .catch(err=> {res.json(err)})
        })

    serviceRouter.route('/search')
      .post( (sol, res)=> {
        db.collection('Services')
        .get()
        .then( services => {
          
          
          let busqueda = sol.body.busqueda
          let results = []
          services.forEach( service => {
            service = { serviceId: service.id, ...service.data() }
            let regex = new RegExp(busqueda, 'i');
            if (regex.test(service.Descripcion)) {
              results.push( service )
            } 
          })
          res.status(200).json({Results:results})  
          
        })
        .catch(() => res.status(400).json({error:"Error al buscar en servicios"}))
      })
    app.use('/service', serviceRouter)

}