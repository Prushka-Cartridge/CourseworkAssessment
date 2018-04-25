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

MongoClient.connect(url, function(err, database) {
    if (err) throw err;
    db = database;
    console.log('listening on 8080');
});

app.get('/', function(req, res) {
    if(req.session.loggedin){
        console.log("logged in");
        res.render('pages/MainPage');
        return;
    } else {
        console.log("logged out");
        res.render('pages/MainPage');
        return;
    }
});

app.get('/SearchPage', function(req, res) {
    if(req.session.loggedin){
        console.log("logged in");
        res.render('pages/SearchPage');
        return;
    } else {
        console.log("logged out");
        res.render('pages/SearchPage');
        return;
    }
});

app.get('/MoviePage', function(req, res) {
    if(req.session.loggedin){
        console.log("logged in");
        res.render('pages/MoviePage');
        return;
    } else {
        console.log("logged out");
        res.render('pages/MoviePage');
        return;
    }
});


app.get('/testing', function(req, res) {
    res.render('pages/testing');
});


app.post('/Login', function(req, res) {
    db.collection('UserInfo').find().toArray(function(err, result){
        if (err) throw err;
        for(int i = 0; i < result.length; i++){
            if(result.username == req.body.username && result.password == req.body.password){
                console.log('Login')
                req.session.loggedin = true;
                res.redirect("/");
            }
        }
        console.log("Username isn't in the system");
    })
})

app.post('/SignUp', function(req, res) {
    db.collection('UserInfo').save(req.body, function(err, result) {
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

/*
db.collection('UserInfo').save(req.body, function(err, result) {
if (err) throw err;
console.log('Saved')
res.redirect('/')
})
});

app.post('/', function(req, res) {
db.collection('UserInfo').find(req.body).toArray(function(err, result) {
if (err) throw err;
console.log(req.body.username);
})
});
*/
app.use(express.static('public'))
app.use(express.static(__dirname + '/views'));

app.listen(8080);
console.log('8080 is the magic port');
