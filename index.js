const express= require('express'),
bodyParser= require('body-parser'),
uuid= require('uuid'),
morgan= require('morgan');

const app= express();

app.use(bodyParser.json());

let movies= [
    {
        'title': 'Requiem for a Dream',
        'description': 'The drug-induced utopias of four Coney Island people are shattered when their addictions run deep.',
        'genre': {
            'name': 'Drama',
            'description': 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        'year': '2000',
        'duration': '1h 42min',
        'director': {
            'name': 'Darren Aronofsky',
            'bio': 'Darren Aronofsky was born February 12, 1969, in Brooklyn, New York. Growing up, Darren was always artistic: he loved classic movies and, as a teenager, he even spent time doing graffiti art. After high school, Darren went to Harvard University to study film (both live-action and animation).',
            'birth': 'February 12, 1969'
        }
    },
    {
        'title': 'Eternal Sunshine of the Spotless Mind',
        'description': 'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories for ever.',
        'genre': {
            'name': 'Drama',
            'description': 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        'year': '2004',
        'duration': '1h 48min',
        'director': {
            'name': 'Michel Gondry',
            'bio': 'He grew up in Versailles with a family who was very influenced by pop music. When he was young, Gondry wanted to be a painter or an inventor. In the 80s he entered in an art school in Paris where he could develop his graphic skills and where he also met friends with whom he created a pop-rock band called Oui-Oui.',
            'birth': 'May 8, 1963'
        }
    },
    {
        'title': 'The Truman Show',
        'description': 'An insurance salesman discovers his whole life is actually a reality TV show.',
        'genre': {
            'name': 'Comedy',
            'description': 'Comedy film is a genre of film in which the main emphasis is on humor.'
        },
        'year': '1998',
        'duration': '1h 43min',
        'director': {
            'name': 'Peter Weir',
            'bio': 'Peter Weir was born on August 21, 1944 in Sydney, New South Wales, Australia. He is a director and writer, known for Master and Commander: The Far Side of the World (2003), The Way Back (2010) and Witness (1985). He has been married to Wendy Stites since 1966.',
            'birth': 'August 21, 1944'
        }
    },
    {
        'title': 'American Beauty',
        'description': 'A sexually frustrated suburban father has a mid-life crisis after becoming infatuated with his daughter\'s best friend.',
        'genre': {
            'name': 'Drama',
            'description': 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        'year': '1999',
        'duration': '2h 2min',
        'director': {
            'name': 'Sam Mendes',
            'bio': 'Sir Samuel Alexander Mendes CBE (born 1 August 1965) is a British film and stage director, producer, and screenwriter. In 2000, Mendes was appointed a CBE for his services to drama, and he was knighted in the 2020 New Years Honours List.',
            'birth': 'August 1, 1965'
        }
    },
    {
        'title': 'Pay It Forward',
        'description': 'A young boy attempts to make the world a better place after his teacher gives him that chance.',
        'genre': {
            'name': 'Drama',
            'description': 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        'year': '2000',
        'duration': '2h 3min',
        'director': {
            'name': 'Mimi Leder',
            'bio': 'Miriam Leder is an American film and television director and producer; she is noted for her action films and use of special effects. She has directed the films The Peacemaker (1997), Deep Impact (1998), Pay It Forward (2000), and On the Basis of Sex (2018). She was the first female graduate of the AFI Conservatory, in 1973. She has been nominated for ten Emmy Awards, winning two',
            'birth': 'January 26, 1952'
        }
    }
];

let users= [
    {
        id: 1,
        name: 'Steve Sims',
        favoriteMovies: []
    },
    {
        id: 2,
        name: 'Joe Doe', 
        favoriteMovies: [
            {
                'title': 'Pay It Forward'
            }
        ] 
    }
]

//Logging with Morgan
app.use(morgan('common'));

//GET requests
app.get('/', (req, res)=> {
    res.send('Welcome to myFlix app');
});

//Get a list of all movies
app.get('/movies', (req, res)=> {
    res.status(200).json(movies);
});

//Get data about a single movie by title
app.get('/movies/:title', (req, res)=> {
    const title= req.params.title;
    const movie= movies.find(movie=> movie.title === title);

    if(movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

//Get data about a genre
app.get('/movies/genre/:genreName', (req, res)=> {
    const {genreName}= req.params;
    const genre= movies.find(movie=> movie.genre.name === genreName).genre;

    if(genre) {
        res.status(200).json(genre);
    } else {
        res.status(404).send('Genre not found');
    }
});

//Get data about a single director by name
app.get('/movies/director/:directorName', (req, res)=> {
    const {directorName}= req.params;
    const director= movies.find(movie=> movie.director.name === directorName).director;

    if(director) {
        res.status(200).json(director);
    } else {
        res.status(404).send('Director not found');
    }
});

//Add new user
app.post('/users', (req, res)=> {
    const newUser= req.body;

    if(!newUser.name) {
        const message= 'Missing name in request body'
        res.status(400).send(message);
    } else {
        newUser.id= uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }
});

//Update a user's username
app.put('/users/:id', (req, res)=> {
    const {id}= req.params;
    const updateUser= req.body;

    let user= users.find(user=> user.id == id);

    if(user) {
        user.name= updateUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('User not found');
    }
});

//Add a movie to a user's favorites
app.post('/users/:id/:movieTitle', (req, res)=> {
    const {id, movieTitle}= req.params;

    let user= users.find(user=> user.id == id)

    if(user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(movieTitle + ' has now been added to user ' + user.id + '\'s Favorites.');
    } else {
        res.status(404).send('User not found.')
    }
});

//Remove a movie from a user's favorites
app.delete('/users/:id/:movieTitle', (req, res)=> {
    const {id, movieTitle}= req.params;

    let user= users.find(user=> user.id == id)

    if(user) {
        user.favoriteMovies= user.favoriteMovies.filter(title=> title !== movieTitle);
        res.status(200).send(movieTitle + ' has now been removed from user ' + user.id + '\'s Favorites.');
    } else {
        res.status(404).send('User not found.')
    }
});

//Remove a user
app.delete('/users/:id', (req, res)=> {
    const {id}= req.params;

    let user= users.find(user=> user.id == id);

    if(user) {
        users= users.filter(user=> user.id !=id);
        res.status(200).send('User ' + user.id + ' has been deleted.')
    } else {
        res.status(404).send('User not found.')
    }
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