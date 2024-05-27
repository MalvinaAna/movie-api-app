const mongoose= require('mongoose');
const Models= require('./models.js');

const Movies= Models.Movie;
const Users= Models.User;

const express= require('express'),
bodyParser= require('body-parser'),
uuid= require('uuid'),
morgan= require('morgan');

const {check, validationResult}= require('express-validator');

const app= express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const cors= require('cors');
app.use(cors());

let auth= require('./auth')(app);

const passport= require('passport');
require('./passport');

//Integrating Mongoose with REST API
//mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

//Logging with Morgan
app.use(morgan('common'));

//default response
app.get('/', (req, res)=> {
    res.send('Welcome to myFlix app');
});

//Get a list of all movies
app.get('/movies', async (req, res)=> {
    await Movies.find()
    .then((movies)=> {
        res.status(201).json(movies);
    })
    .catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get data about a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), async (req, res)=> {
    await Movies.findOne({Title: req.params.Title})
    .then((movie)=> {
        res.json(movie);
    })
    .catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get data about a genre
app.get('/movies/Genre/:GenreName', passport.authenticate('jwt', {session: false}), async (req, res)=> {
    await Movies.findOne({'Genre.Name': req.params.GenreName}, {'Genre.$': 1})
    .then((genre)=> {
        res.json(genre.Genre);
    })
    .catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get data about a single director by name
app.get('/movies/Director/:DirectorName', passport.authenticate('jwt', {session: false}), async (req, res)=> {
    await Movies.findOne({'Director.Name': req.params.DirectorName}, {'Director.$': 1})
    .then((director)=> {
        res.json(director.Director);
    })
    .catch((err)=> {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

// Get data about a single user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // Extract the username from the JWT token
  const authenticatedUsername = req.user.Username;

  // Compare the username in the token with the one in the request parameters
  if (req.params.Username !== authenticatedUsername) {
    return res.status(403).send('Error: You are not authorized to access this user\'s data');
  }

  try {
    // Fetch the user data from the database
    const user = await Users.findOne({ Username: req.params.Username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('Error: User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Add new user
app.post('/users',
//Validation logic here for request
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req,res)=> {

    //check the validation object for errors
    let errors= validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    

    let hashedPassword= Users.hashPassword(req.body.Password);
    await Users.findOne({Username: req.body.Username})
    .then((user)=> {
        if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user)=> {res.status(201).json(user) })
            .catch((error)=> {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    });
});

//Update a user's username
app.put('/users/:Username', 
 //Validation logic here for request
 [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', {session: false}), async (req, res)=> {

    //check the validation object for errors
    let errors= validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

    //Condition to check if the username in the request body matches the one in the request parameter
    if(req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    //Condition ends here
    await Users.findOneAndUpdate({Username: req.params.Username}, {$set: 
    {
        Username: req.body.Username,
        Password: req.body.Password, 
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
},
{new: true}) //This line makes sure that the updated document is returned
.then((updatedUser)=> {
    res.json(updatedUser);
})
.catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
})
});

//Add a movie to a user's favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res)=> {
    await Users.findOneAndUpdate({Username: req.params.Username}, {
        $push: {FavoriteMovies: req.params.MovieID}
    },
{new: true}) //This line makes sure that the updated document is returned
.then((updatedUser)=> {
    res.json(updatedUser);
})
.catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
});
});

//Remove a movie from a user's favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res)=> {
    await Users.findOneAndUpdate({Username: req.params.Username}, {
        $pull: {FavoriteMovies: req.params.MovieID}
    },
{new: true})
.then((updatedUser)=> {
    res.json(updatedUser);
})
.catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
});
});

//Remove a user
app.delete('/users/:Username', async (req, res)=> {
    await Users.findOneAndDelete({Username: req.params.Username})
    .then((user)=> {
        if(!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted');
        }
    })
    .catch((err)=> {
        console.err(err);
        res.status(500).send('Error: ' + err);
    });
});

//Serve static file
app.use(express.static('public'));

//Error-handling middleware function
app.use((err, req, res, next)=> {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//listen for requests
const port= process.env.PORT || 8080;
app.listen(port, '0.0.0.0', ()=> {
    console.log('Listening on Port ' + port);
});