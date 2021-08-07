const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (res, res) {
  res.sendFile(__dirname + "/index.html");
});


app.post("/failure", function(req, res){
  res.redirect("/");
})

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  console.log(firstName + lastName + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  console.log(jsonData);

  const url = "https://us5.api.mailchimp.com/3.0/lists/113a4502ab";
  const options = {
    method: "POST",
    auth: "aryan:45e70d7a8b8ce9362d4177340e79024b-us5",
  };

  const request = https.request(url, options, function (response) {
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});


app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("server started");
});


