var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var as = require("./as");
var getting_data = require("./getting_data");
var session = require("express-session");
var passport = require("passport");

const app = express();

router.post("/watson_api", as.watson_api);

let port = 4000;
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "XCR3rsasa%RDHHH",
        cookie: { maxAge: 60000 }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "http://192.168.1.53:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-With, Content-Type, Accept"
    );
    next();
});

app.use("/", router);

app.listen(port, () => {
    console.log("server is running at ", port);
});

// var x = getting_data.get_price("aapl")
// console.log(x)
