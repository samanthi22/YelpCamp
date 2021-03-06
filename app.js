var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var flash = require("connect-flash");

// var passportLocalMongoose = require("passport-local-mongoose");
// added passport-local

var commentRoutes = require("./routes/comments"), 
    campgroundRoutes = require("./routes/campgrounds"), 
    indexRoutes = require("./routes/index");
    
// use two different databases - one for production mLab and one for development

//console.log(process.env.DATABASEURL);
//process.env.DATABASEURL //  environment variable
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(methodOverride("_method"));

// added middleware
app.use(require("express-session")({
   secret: 'banana',
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    //res.locals.currentUser = req.user;
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



//seedDB();

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp Server Has started!"); 
});