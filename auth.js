const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

  require('./passport'); // Simply require the passport file

/**
 * Generates a JSON Web Token (JWT) for a given user.
 * @param {Object} user - The user object containing the user's information.
 * @param {string} user.Username - The username of the user to encode in the JWT.
 * @returns {string} - The signed JWT as a string.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}


/**
 * POST login route. Authenticates the user and generates a JWT upon successful login.
 * @param {Object} router - The Express router object.
 * @returns {void}
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', {session: false}, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}