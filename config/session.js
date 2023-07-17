const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

module.exports = app => {
   // required for deployment to Heroku
  app.set('trust proxy', 1);


  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        //maxAge: 100000 // 60 * 1000 ms === 1 min
      },
      store: MongoStore.create({
        mongoUrl: "mongodb+srv://bizwheels-main-db-01e5d5349eb:6XR2S8Fe2K9cpqq3QX5V7S28HQkgEW@prod-us-central1-2.ih9la.mongodb.net/bizwheels-main-db-01e5d5349eb",
        ttl: 60 * 60 * 24 * 1 // 60sec * 60min * 24day => 1 day
      })
    })
  );
};
