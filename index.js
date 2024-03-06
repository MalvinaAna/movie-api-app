const express= require('express'),
morgan= require('morgan');

const app= express();

let topMovies= [
    {
        Title: 'The Hunchback of Notre Dame',
        Genre: 'Animation',
        Year: '1996',
        Duration: '1h 31min',
        Directors: 'Gary Trousdale, Kirk Wise',
        Writers: 'Tab Murphy, Victor Hugo, Irene Mecchi'
    },
    {
        Title: 'The Lion King', 
        Genre: 'Animation', 
        Year: '1994', 
        Duration: '1h 28min', 
        Directors: 'Roger Allers, Rob Minkoff', 
        Writers: 'Irene Mecchi, Jonathan Roverts, Linda Woolverton'
    },
    {
        Title: 'Mulan',
        Genre: 'Animation', 
        Year: '1998',
        Duration: '1h 27min',
        Directors: 'Tony Bancroft, Barry Cook',
        Writers: 'Robert D. San Souci, Rita Hsiao, Chris Sanders'
    },
    {
        Title: 'Beauty and the Beast',
        Genre: 'Animation', 
        Year: '1991',
        Duration: '1h 24min', 
        Directors: 'Gary Trousdale, Kirk Wise', 
        Writers: 'Linda Woolverton, Brenda Chapman, Chris Sanders'
    },
    {
        Title: 'The Little Mermaid', 
        Genre: 'Animation', 
        Year: '1989',
        Duration: '1h 23min',
        Directors: 'Ron Clements, John Musker',
        Writers: 'John Musker, Ron Clements, Hans Christian Andersen'
    },
    {
        Title: 'Alladin', 
        Genre: 'Animation', 
        Year: '1992',
        Duration: '1h 30min',
        Directors: 'Ron Clements, John Musker', 
        Writers: 'Ron Clements, John Musker, Ted Elliott'
    },
    {
        Title: 'Toy Story',
        Genre: 'Animation', 
        Year: '1995',
        Duration: '1h 21min',
        Director: 'John Lasseter', 
        Writers: 'John Lasseter, Pete Docter, Andrew Stanton'
    }, 
    {
        Title: '101 Dalmatians', 
        Genre: 'Animation', 
        Year: '1996', 
        Duration: '1h 43min', 
        Director: 'Stephen Herek', 
        Writers: 'Dodie Smith, John Hughes'
    },
    {
        Title: 'The Prince of Egypt', 
        Genre: 'Animation', 
        Year: '1998', 
        Duration: '1h 39m', 
        Directors: 'Brenda Chapman, Steve Hickner, Simon Wells', 
        Writers: 'Philip LaZebnik, Nicholas Meyer'
    }, 
    {
        Title: 'Spirit: Stallion of the Cimarron',
        Genre: 'Animation', 
        Year: '2002',
        Duration:'1h 32min', 
        Directors: 'Kelly Asbury, Lorna Cook', 
        Writers: 'John Fusco'
    }
];

//Logging with Morgan
app.use(morgan('common'));

//GET requests
app.get('/', (req, res)=> {
    res.send('Welcome to myFlix app');
});

app.get('/movies', (req, res)=> {
    res.json(topMovies);
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