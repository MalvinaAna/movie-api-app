const mongoose= require('mongoose');
const Models= require('./models.js');

const Movies= Models.Movie;
const Users= Models.User;

const express= require('express'),
bodyParser= require('body-parser'),
uuid= require('uuid'),
morgan= require('morgan');

const app= express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//Integrating Mongoose with REST API
mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});

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
app.get('/movies/:Title', async (req, res)=> {
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
app.get('/movies/Genre/:GenreName', async (req, res)=> {
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
app.get('/movies/Director/:DirectorName', async (req, res)=> {
    await Movies.findOne({'Director.Name': req.params.DirectorName}, {'Director.$': 1})
    .then((director)=> {
        res.json(director.Director);
    })
    .catch((err)=> {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

//Add new user
app.post('/users', async (req,res)=> {
    await Users.findOne({Username: req.body.Username})
    .then((user)=> {
        if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: req.body.Password,
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
app.put('/users/:Username', async (req, res)=> {
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
app.post('/users/:Username/movies/:MovieID', async (req, res)=> {
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
app.delete('/users/:Username/movies/:MovieID', async (req, res)=> {
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
app.listen(8080, ()=> {
    console.log('App listening on port 8080.');
});