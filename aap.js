var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var as = require("./as");
var getting_data = require("./getting_data");
var session = require("express-session");

const app = express();

router.post("/watson_api", as.watson_api);

let port = 4000;
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use("/", router);

app.listen(port, () => {
    console.log("server is running at ", port);
});

// var x = getting_data.get_price("aapl")
// console.log(x)
