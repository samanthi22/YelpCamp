var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");
var passport = require("passport");
var passportLocalMongoose = require("passport-local-mongoose");
// added passport-local
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

var commentRoutes = require("./routes/comments"), 
    campgroundRoutes = require("./routes/campgrounds"), 
    indexRoutes = require("./routes/index")

// added middleware
app.use(require("express-session")({
    secret: 'banana',
   resave: false,
   saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});



mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.use(express.static(__dirname + "/public"));
// SCHEMA setup
app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp Server Has started!"); 
});