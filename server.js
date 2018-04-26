var express = require('express');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/MovieReviews";
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser');
var app = express();

app.use(session({ secret: 'example' }));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser());
app.set('view engine', 'ejs');

//THIS CODE BELOW SHOULD CREATE A DATABASE

var db;
var username;
var password = "";
MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database;
    console.log('listening on 8080');
});

app.get('/', function(req, res) {
    if(req.session.loggedin){
        db.collection('UserInfo').findOne({"login.username":username}, function(err, result) {
            console.log("logged in");
            res.render('pages/MainPageLoggedIn', {user: result});
            return;
        })
    } else {
        console.log("logged out");
        res.render('pages/MainPage');
        return;
    }
});

app.get('/SearchPage', function(req, res) {
    if(req.session.loggedin){
        db.collection('UserInfo').findOne({"login.username":username}, function(err, result) {
        console.log("logged in");
        res.render('pages/SearchPageLoggedIn', {user: result});
        return;
    })
    } else {
        console.log("logged out");
        res.render('pages/SearchPage');
        return;
    }
});

app.get('/MoviePage', function(req, res) {
    if(req.session.loggedin){
        db.collection('UserInfo').findOne({"login.username":username}, function(err, result) {
            console.log("logged in");
            res.render('pages/MoviePageLoggedIn', {user: result});
        })
    } else {
        console.log("logged out");
        res.render('pages/MoviePage');
    }
    var output = "";
    db.collection('MovieInfo').find({title:req.body.title}).toArray(function(err, results) {
        if (err) throw err;
        console.log(req.body.title);
        if(!results){
            output += "No reviews exist for this movie";
        } else {
            for(var i = 0; i < results.length; i++){
                output += "<div> <div>Created By:"+results.login.username+"</div>";
                output += "<div> Review:"+results.MovieReview.review+"</div> </div>"
            }
        }

    })
    console.log(output);
});


app.get('/testing', function(req, res) {
    res.render('pages/testing');
});


app.post('/Login', function(req, res) {
    username = req.body.username;
    password = req.body.password;
    db.collection('UserInfo').findOne({"login.username":username}, function(err, result) {
        if (err) throw err;

        if(!result){
            res.redirect('/');
            return
        }

        if(result.login.password == password){
            console.log('Login')
            req.session.loggedin = true;
            res.redirect("/");
            console.log("Username is in the system");
            return;
        } else {
            alert("Incorrect Password")
            console.log("Username isn't in the system");
            res.redirect("/");
            return;
        }
    })
})

app.post('/LogOut', function(req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
})

app.post('/SignUp', function(req, res) {
    var datatostore = {
    //"gender":req.body.gender,
    "name":{"firstname":req.body.firstname,"surname":req.body.surname},
    //"location":{"street":req.body.street,"city":req.body.city,"state":req.body.state,"postcode":req.body.postcode},
    //"email":req.body.email,
    "login":{"username":req.body.username,"password":req.body.password},
    //"dob":req.body.dob,"registered":Date(),
    //"picture":{"large":req.body.large,"medium":req.body.medium,"thumbnail":req.body.thumbnail},
    //"nat":req.body.nat
    }

    db.collection('UserInfo').save(datatostore, function(err, result) {
        if (err) throw err;
        console.log('SignUp')
        res.redirect("/")
    })
})

app.post('/testing', function(req, res) {
    db.collection('UserInfo').drop(function(err, result){
        if (err) throw err;
        console.log('test')
        res.redirect("/")
    })
})

app.post('/addMovie', function(req, res) {
    if(!username){
        var datatostore = {
        "login":{"username":"Guest"},
        "MovieInfo":{"title":req.body.movieTitle},
        "MovieReview":{"review":req.body.movieReview},
        }
    } else {
        var datatostore = {
        "login":{"username":username},
        "MovieInfo":{"title":req.body.movieTitle},
        "MovieReview":{"review":req.body.movieReview},
        }
    }

    db.collection('MovieInfo').save(datatostore, function(err, result) {
        if (err) throw err;
        console.log('SignUp')
    })
    res.redirect("/")
})


app.use(express.static('public'))
app.use(express.static(__dirname + '/views'));

app.listen(8080);
console.log('8080 is the magic port');
