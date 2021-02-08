// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const getCSV = require("get-csv");
const crypto = require("crypto");
const lodash = require("lodash");

const app = express();
app.use(express.json());

// 4. function to generate random identifier
function rand_identifier() {
  const random = crypto.randomBytes(20).toString("hex");

  // Hash token and set to conversion_key variable
  const conversion_key = crypto
    .createHash("sha256")
    .update(random)
    .digest("hex");
  return conversion_key;
}

// fetch CSV from url and parse its data into an object
app.post("/", (request, response) => {
  // check csv url
  if (!request.body.csv.url) {
    response
      .json({
        success: false,
        message: "Please enter a url to the CSV file"
      })
      .status(500);
  }
  try {
    getCSV(request.body.csv.url)
      //   1. check validity and return errors if any
      .catch(error =>
        response.json({ message: "Invalid CSV url", error }).status(400)
      )
      // 2. or process object if none
      .then(data => {
        var object;
        var filtered_array = [];
        for (object of data) {
          // 3. The JSON array should only contain the fields specified in the "select_fields" parameter.
          if (request.body.csv.select_fields) {
            var filtered_object = lodash.pick(
              object,
              request.body.csv.select_fields
            );
            filtered_array.push(filtered_object);
          } else {
            filtered_array = data;
          }
        }
        // return json response with conversion key
        response
          .json({
            conversion_key: rand_identifier(),
            json: filtered_array
          })
          .status(200);
      });
    // handle other errors
  } catch {
    response
      .json({
        success: false,
        message: "An error occured, please try again later"
      })
      .status(500);
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
