const dotenv = require('dotenv');

dotenv.config();

if (
  !process.env.GOOGLE_CLIENT_ID
  || !process.env.GOOGLE_CLIENT_SECRET
) {
  console.error('\nMissing config:\nYou must provide both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.\n');
  process.exit(1);
}

const production = process.env.NODE_ENV === 'production';

const sessionSecret = process.env.SESSION_SECRET || 'superunsecuresecret';
if (
  production
  && sessionSecret === 'superunsecuresecret'
) {
  console.warn('\nSecurity warning:\nYou must provide a random SESSION_SECRET.\n');
}

module.exports = {
  defaultRooms: [
    { name: 'English 101', flag: 'gb' },
    { name: 'English intermediate', flag: 'gb' },
    { name: 'English advanced', flag: 'gb' },
    { name: 'Spanish 101', flag: 'es' },
    { name: 'Spanish intermediate', flag: 'es' },
    { name: 'Spanish advanced', flag: 'es' },
  ],
  googleAuth: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientOrigin: process.env.GOOGLE_CLIENT_ORIGIN || 'http://localhost:8080',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK || 'http://localhost:8081/user/google/authenticate',
  },
  mongoURI: (
    process.env.MONGO_URI
    || 'mongodb://localhost/babelchat'
  ),
  port: process.env.PORT || 8081,
  production,
  sessionSecret,
};
