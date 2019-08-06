var AssistantV1 = require("ibm-watson/assistant/v1");
var getting_data = require("./getting_data");

var assistant = new AssistantV1({
    iam_apikey: "zrdB0kljERgI8zUJhf9xFCMfG03mKrmTDH6iVaat-cid",
    url: "https://gateway-lon.watsonplatform.net/assistant/api",
    version: "2019-02-28"
});

var session = null;

exports.watson_api = async (req, res) => {
    //fetching any live values that is needed
    session = req.session;
    session.output = "";
    if (!session.created) {
        session.created = true;
        session.context = {};
    }

    await assistant
        .message({
            input: { text: req.body.input }, //message input by the user
            workspace_id: "e3083f39-f7fd-44fc-94e8-600e010d5cf8", //workspace id
            context: session.context //previous context
        })
        .then(async result => {
            session.context = result.context; //context given by the watson
            console.log(session.context);

            if (result.context.action != undefined) {
                if (result.context.action == "multiply") {
                    var n = Number(result.context.first_number);
                    session.context.multiplied = n * 9;
                    //resetting
                    session.context.action = "";

                    //calling watson
                    await assistant
                        .message({
                            input: { text: "test sample" }, //message input by the user
                            workspace_id:
                                "e3083f39-f7fd-44fc-94e8-600e010d5cf8", //workspace id
                            context: session.context //previous context
                        })
                        .then(data => {
                            session.context = data.context;
                            console.log(session.context);
                            session.context.multiplied = "";
                            session.context.action = "";

                            session.output =
                                session.output + data.output.generic[0].text;
                            console.log(session.output);
                        });
                }
            }
            if (result.output.generic[0] != undefined) {
                session.output += result.output.generic[0].text;
            } else {
                session.output = "Sorry, some error occured";
            }

            res.send(session.output);
            session.output = "";
        })
        .catch(err => {
            console.log(err);
            res.send("Sorry, let's start again.");
        });

    console.log("------------------------------------------------");
};
