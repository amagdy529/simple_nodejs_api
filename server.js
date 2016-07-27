var express    = require('express');

var app 	   = express();


var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/node_api_db1');

var Bear = require('./app/models/bear');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

var port = process.env.PORT || 8080 ;

var router = express.Router();


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});



router.get('/',function(req,res){
    res.json({ message: 'welcome to first node app !' });
});


router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

    })

//router.route('/bears')  # they are chained we dont need to call rout() again

    .get(function(req, res) {
          Bear.find(function(err, bears) {
              if (err)
                  res.send(err);

              res.json(bears);
          });
    });


router.route('/bears/:bear_id')

    .get(function(req , res){
          Bear.findById(req.params.bear_id, function(err, bear) {
              if (err)
                  res.send(err);
              res.json(bear);
          });
    })

    .put(function(req , res){
          Bear.findById(req.params.bear_id , function(err , bear){
              if(err)
                res.send(err);
              bear.name = req.body.name;

              bear.save(function(err){
                  if(err)
                    res.send(err);
                  res.json({message:'the bear is fuckin updated !'});
              });
          });
    })

    .delete(function(req , res){
          Bear.remove({_id:req.params.bear_id} ,
            function(err , bear){
                  if(err)
                    res.send(err);
                  res.json({message:"u deleted the bear successfully!"});
            });
    });




app.use('/api' , router);

app.listen(port);

console.log('we are working on port : ' + port);
