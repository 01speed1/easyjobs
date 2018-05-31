let express = require("express");

//middlewares
let verifyToken = require('../middlewares/verifyToken');  //verifyToken

module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();

  //router Categories
  let categoryRouter =  express.Router();

  categoryRouter.route('/new')
      .post(verifyToken, (sol, res)=>{
        db.collection('Categories').add({...sol.body})
            .then( category => db.collection('Categories').doc(category.id).get() )
            .then( category => {res.json({categoryCreated:true, id:category.id, ...category.data()})
            })
            .catch(err => {res.json({categoryCreated:false, ...err })})

      })

  categoryRouter.route('/all')
      .post(verifyToken,(sol, res)=>{

        db.collection('Categories').get()
            .then(categories =>{

              categories =  categories.docs.map( c => {
                return { categoryId:c.id, ...c.data()}
              })

              res.json({Categories:categories})

            })
            .catch( err => {res.json( err )} )
      });

  categoryRouter.route('/view/:sid')
      .post(verifyToken,(sol, res)=>{
        db.collection('Categories').doc(sol.params.sid).get()
            .then((category)=>{
              if (category.exists){
                res.json( { categoryId:category.id, ...category.data()} )
              }

              else {res.json( {categoryExists:false} )}

            })
            .catch((err)=>{
              res.json(err)
            })
      });

  categoryRouter.route('/update/:sid')
      .post(verifyToken,(sol, res)=>{
        db.collection('Categories').doc(sol.params.sid).update({...sol.body})

            .then( ()=> db.collection('Categories').doc(sol.params.sid).get() )

            .then((service)=>{
              res.json({serviceUpdated:true, serviceId: service.id, ...service.data()})
            })
            .catch((err)=>{
              res.json(err)
            })
      })

  categoryRouter.route('/delete/:sid')
      .post(verifyToken,(sol, res)=>{
        db.collection('Categories').doc(sol.params.sid).delete()
            .then(()=> {res.json( {categoryDeleted:true })})
            .catch(err=> {res.json(err)})
      })

  app.use('/category', categoryRouter)

}