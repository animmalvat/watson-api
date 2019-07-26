var AssistantV1 = require("ibm-watson/assistant/v1");
var getting_data = require("./getting_data");

var assistant = new AssistantV1({
    iam_apikey: "zrdB0kljERgI8zUJhf9xFCMfG03mKrmTDH6iVaat-cid",
    url: "https://gateway-lon.watsonplatform.net/assistant/api",
    version: "2019-02-28"
});

var session;

exports.watson_api = async (req, res) => {
    //fetching any live values that is needed
    session = req.session;
    if (session.created != undefined) {
        session.context = {};
        session.intent = {};
        session.stock_data = {};
        session.isShowStock = false;
        session.isSellStock = false;
        session.isBuyStock = false;
        session.created = true;
    }

    await fetchingLiveValues();

    async function fetchingLiveValues() {
        //getting all the details from the api for show stock api
        if (session.isShowStock) {
            console.log("showing stock details");
            session.isShowStock = false;
            await getting_data.get_price(req.body.input).then(value => {
                console.log("value success : ", value.success);
                if (value.success == "true") {
                    session.context["stock_low"] = value.latestPrice;
                    session.context["stock_high"] = value.latestPrice;
                    session.context["stock_close"] = value.latestPrice;
                    session.context["stock_volume"] = value.latestPrice;
                    session.context["stock_available"] = true;
                } else {
                    session.context["stock_available"] = false;
                }
            });
        }

        //setting up the stock price using api for buying dialouges
        if (session.isBuyStock) {
            console.log("getting live data for buying");
            session.isBuyStock = false;
            await getting_data.get_price(req.body.input).then(value => {
                //got the price from live api
                if (value.success == "true") {
                    session.context["stock_value"] = value.latestPrice;
                    session.context["stock_available"] = true;
                } else {
                    session.context["stock_available"] = false;
                }
            });
        }

        //setting up the stock price using api for selling dialouges
        if (session.isSellStock) {
            console.log("getting data for sell stock");
            session.isSellStock = false;

            await getting_data.get_price(req.body.input).then(value => {
                //got the price from live api
                if (value.success == "true") {
                    session.context["stock_value"] = value.latestPrice;
                    session.context["stock_available"] = true;
                } else {
                    session.context["stock_available"] = false;
                }
            });
        }
    }

    assistant
        .message({
            input: { text: req.body.input.replace(/(\r\n|\n|\r)/gm, "") }, //message input by the user
            workspace_id: "867868bf-d9bd-4d84-8fa2-486fce2d79e8", //workspace id
            context: session.context //previous context
        })
        .then(result => {
            session.context = result.context; //context given by the watson

            if (result.intents[0] != undefined) {
                console.log("intent : ", result.intents[0].intent);
                if (result.intents[0].intent == "show_stock_details") {
                    session.isShowStock = true;
                    console.log("show stock : ", session.isShowStock);
                }
                // checking if the user is interested in buying stocks
                if (result.intents[0].intent == "buy_stock") {
                    session.isBuyStock = true;
                    console.log("buy stock : ", session.isBuyStock);
                }

                // checking if the user is interested in selling stocks
                if (result.intents[0].intent == "sell_stock") {
                    session.isSellStock = true;
                    console.log("sell stock : ", session.isSellStock);
                }
            }
            res.send(result.output.generic[0].text);
        })
        .catch(err => {
            console.log(err);
        });
};
