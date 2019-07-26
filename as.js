var AssistantV1 = require("ibm-watson/assistant/v1");
var getting_data = require("./getting_data");

var assistant = new AssistantV1({
    iam_apikey: "zrdB0kljERgI8zUJhf9xFCMfG03mKrmTDH6iVaat-cid",
    url: "https://gateway-lon.watsonplatform.net/assistant/api",
    version: "2019-02-28"
});

//variables to reference the previous context and intents
var context,
    intent,
    stock_data = {};
//to check what is the intent of the user in the last message
var isShowStock,
    isSellStock,
    isBuyStock = false;

exports.watson_api = async (req, res) => {
    //fetching any live values that is needed
    await fetchingLiveValues();

    async function fetchingLiveValues() {
        //getting all the details from the api for show stock api
        if (global.isShowStock) {
            console.log("showing stock details");
            global.isShowStock = false;
            await getting_data.get_price(req.body.input).then(value => {
                console.log("value success : ", value.success);
                if (value.success == "true") {
                    global.context["stock_low"] = value.latestPrice;
                    global.context["stock_high"] = value.latestPrice;
                    global.context["stock_close"] = value.latestPrice;
                    global.context["stock_volume"] = value.latestPrice;
                    global.context["stock_available"] = true;
                    console.log("stock not ");
                } else {
                    console.log("stock avail");
                    global.context["stock_available"] = false;
                }
            });
        }

        //setting up the stock price using api for buying dialouges
        if (global.isBuyStock) {
            console.log("getting live data for buying");
            global.isBuyStock = false;
            await getting_data.get_price(req.body.input).then(value => {
                //got the price from live api
                if (value.success == "true") {
                    global.context["stock_value"] = value.latestPrice;
                    global.context["stock_available"] = true;
                } else {
                    global.context["stock_available"] = false;
                }
            });
        }

        //setting up the stock price using api for selling dialouges
        if (global.isSellStock) {
            console.log("getting data for sell stock");
            global.isSellStock = false;
            await getting_data.get_price(req.body.input).then(value => {
                //got the price from live api
                if (value.success == "true") {
                    global.context["stock_value"] = value.latestPrice;
                    global.context["stock_available"] = true;
                } else {
                    global.context["stock_available"] = false;
                }
            });
        }
    }

    assistant
        .message({
            input: { text: req.body.input }, //message input by the user
            workspace_id: "867868bf-d9bd-4d84-8fa2-486fce2d79e8", //workspace id
            context: global.context //previous context
        })
        .then(result => {
            global.context = result.context; //context given by the watson

            if (result.intents[0] != undefined) {
                console.log("intent : ", result.intents[0].intent);
                if (result.intents[0].intent == "show_stock_details") {
                    global.isShowStock = true;
                    console.log("show stock : ", global.isShowStock);
                    // getting_data.promise1(req.body.input).then(value => {
                    //     console.log(value);
                    // });
                }
                // checking if the user is interested in buying stocks
                if (result.intents[0].intent == "buy_stock") {
                    global.isBuyStock = true;
                    console.log("buy stock : ", global.isBuyStock);
                }

                // checking if the user is interested in selling stocks
                if (result.intents[0].intent == "sell_stock") {
                    global.isSellStock = true;
                    console.log("sell stock : ", global.isSellStock);
                }
            }
            res.send(result.output.generic[0].text);
        })
        .catch(err => {
            console.log(err);
        });
    // console.log("---------------------------------------------");
};

getting_data.get_price("aapl").then(value => console.log(value.success));
