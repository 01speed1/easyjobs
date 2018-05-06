let express = require("express");

//middlewares
let verifyToken = require('../middlewares/verifyToken');


module.exports = (app, fireAdmin) => {

  // database conection
  let db = fireAdmin.firestore();
  // Auth validator
  let auth = fireAdmin.auth();

  // router login
  let loginRouter = express.Router();
  loginRouter.route('/')
      .get((sol, res)=>{
        res.redirect('/log.html')
      })
      .post(verifyToken, (sol, res)=>{



      });
  app.use('/login',loginRouter);


  // router register
  let registerRouter = express.Router();
  registerRouter.route('/')
      .get((sol, res)=>{
        res.redirect('/register.html')
      })
      .post((sol, res)=>{

        let infoNewUser = {
          uid: "5erxBPK7Mkfjlv8r47af8o8ufQ52",
          email: "dfdsf@dfsd.com",
          phone: "111-555-1234",
          country: "Colombia",
          region: "Cundinamarca",
          city: "Puerto Salgar",
          avatar_url: "https://media.creativemornings.com/uploads/user/avatar/116475/round_headshot.png"
        }

        db.collection('Users').doc(infoNewUser.uid).set(infoNewUser)
            .then(()=>{
              res.json({userCreated:true})
            })
            .catch((err)=>{
              res.json(err)
            })



      })
  app.use('/register',registerRouter);



  app.get("/", (sol, res)=>{

    db.collection('People').get()
        .then((people)=>{

          let peopleList = people.docs.map(person =>{
            const id = person.id;
            return {id, ...person.data()};
          });

          res.json(peopleList);
        })
        .catch((err)=>{
          console.log('Error al consultar personas: '+ err);
        });

  });

};


