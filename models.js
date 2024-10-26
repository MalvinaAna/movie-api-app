
const mongoose= require('mongoose');

const bcrypt= require('bcrypt');

/**
 * Movie schema defining the structure of movie documents in MongoDB.
 * @typedef {Object} Movie
 * @property {string} Title - The title of the movie.
 * @property {string} Description - A brief description of the movie.
 * @property {Object} Genre - Genre information.
 * @property {string} Genre.Name - The genre name.
 * @property {string} Genre.Description - A description of the genre.
 * @property {Object} Director - Director information.
 * @property {string} Director.Name - The director's name.
 * @property {string} Director.Bio - A brief bio of the director.
 * @property {string[]} Actors - Array of actors in the movie.
 * @property {string} ImagePath - Path to the movie's image.
 * @property {boolean} Featured - Whether the movie is featured.
 */
let movieSchema= mongoose.Schema({
Title: {type: String, required: true},
Description: {type: String, required: true},
Genre: {
Name: String,
Description: String
},
Director: {
Name: String,
Bio: String
},
Actors: [String],
ImagePath: String,
Featured: Boolean
});

/**
 * User schema defining the structure of user documents in MongoDB.
 * @typedef {Object} User
 * @property {string} Username - The user's username.
 * @property {string} Password - The user's hashed password.
 * @property {string} Email - The user's email.
 * @property {Date} Birthday - The user's birthday.
 * @property {ObjectId[]} FavoriteMovies - Array of movie IDs in user's favorites.
 */
let userSchema= mongoose.Schema({
Username: {type: String, required: true},
Password: {type: String, required: true},
Email: {type: String, required: true},
Birthday: Date,
FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

/**
 * Hashes a password using bcrypt.
 * @function hashPassword
 * @memberof User
 * @static
 * @param {string} password - The plain text password to hash.
 * @returns {string} - The hashed password.
 */
userSchema.statics.hashPassword= (password) => {
    return bcrypt.hashSync(password, 10);
};

/**
 * Validates a user's password.
 * @function validatePassword
 * @memberof User
 * @instance
 * @param {string} password - The plain text password to compare.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
userSchema.methods.validatePassword= function(password) {
    return bcrypt.compareSync(password, this.Password);
};

/** 
 * Mongoose model for movies.
 * @type {Model<Movie>}
 */
let Movie= mongoose.model('Movie', movieSchema);

/** 
 * Mongoose model for users.
 * @type {Model<User>}
 */
let User= mongoose.model('User', userSchema);
module.exports.Movie= Movie;
module.exports.User= User;