const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");

const app =express();

require("./config/passport")(passport);

const url = process.env.MONGO_URL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));





//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


//Bodyparser
app.use(express.urlencoded({extended: false}));

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    }));

app.use(passport.initialize());
app.use(passport.session())


app.use(flash());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash("error");
    next();
});

//routes
app.use('/', require('./routers/index.js'));
app.use('/users', require('./routers/users.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));