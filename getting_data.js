// publishable key = pk_6c5d84dfec7349549abc5016706d632f
var request = require("request");

exports.get_price = function get_price(ticker) {
    return new Promise(function(resolve, reject) {
        console.log("getting data : ", ticker);
        request(
            "https://cloud.iexapis.com/stable/stock/" +
                ticker +
                "/quote?token=pk_6c5d84dfec7349549abc5016706d632f",
            function(error, response, body) {
                if (!error) {
                    try {
                        var result = JSON.parse(body);
                        result.success = "true";
                    } catch (err) {
                        var result = JSON.parse(
                            '{"success":"false", "message":"there is no such symbol"}'
                        );
                    }
                    resolve(result);
                } else {
                    resolve(
                        JSON.parse(
                            '{"success":"false", "message":"there is no such symbol"}'
                        )
                    );
                }
            }
        );
    });
};
