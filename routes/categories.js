let express = require("express");

module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();

  // Auth validator
  let auth = fireAdmin.auth();

  //router Categories
  let categoryRouter =  express.Router();

  categoryRouter.route('/new')
      .post((sol, res)=>{
        db.collection('Categories').add({...sol.body})
            .then( category => db.collection('Categories').doc(category.id).get() )
            .then( category => {res.json({categoryCreated:true, ...category.data()})
            })
            .catch(err => {res.json({categoryCreated:false, ...err })})

      })

  categoryRouter.route('/all')
      .post((sol, res)=>{

        db.collection('Categories').get()
            .then(categories =>{

              categories =  categories.docs.map( c => {
                return { categoryId:c.id, ...c.data()}
              })

              res.json(categories)

            })
            .catch( err => {res.json( err )} )
      });

  categoryRouter.route('/view/:sid')
      .post((sol, res)=>{
        db.collection('Categories').doc(sol.params.sid).get()
            .then((category)=>{
              res.json( { categoryId:category.id, ...category.data()} )
            })
            .catch((err)=>{
              res.json(err)
            })
      });

  categoryRouter.route('/update/:sid')
      .post((sol, res)=>{
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
      .post((sol, res)=>{
        db.collection('Categories').doc(sol.params.sid).delete()
            .then(()=> {res.json( {categoryDeleted:true })})
            .catch(err=> {res.json(err)})
      })

  app.use('/category', categoryRouter)

}