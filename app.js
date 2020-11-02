const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


  // EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
// Public
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended : true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/ayyan_restaurants', require('./routes/ayyanRestaurants.js'));
app.use('/raju_restaurants', require('./routes/rajuRestaurants.js'));
app.use('/hot&spicy_restaurants', require('./routes/HSRestaurants.js'));
app.use('/GIKafe', require('./routes/GIKafe.js'));
app.use('/GIKImess', require('./routes/GIKImess.js'));
const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
