const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const port = 3000;
const fetch = require("cross-fetch");
const appid = "&units=metric&APPID=3e2d927d4f28b456c6bc662f34350957";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/:cityName", (req, res) => {
  console.log();
  query = req.params.cityName;
  console.log(query);
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" + query + appid;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const lat = data.coord.lat;
      console.log(lat);
      const lon = data.coord.lon;
      const url2 =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly,alerts" +
        appid;

      fetch(url2)
        .then((res1) => {
          return res1.json();
        })
        .then((response1) => {
          let dailyArray = [];
          console.log(response1.lat);
          let start = response1.daily[0].sunrise;
          let end = response1.daily[4].moonrise;
          for (let i = 0; i < 5; i++) {
            dailyArray.push({
              temp: response1.daily[i].temp,
              rain: response1.daily[i].rain,
              wind: response1.daily[i].wind_speed,
            });
          }
          console.log(dailyArray);
          const url3 =
            "http://api.openweathermap.org/data/2.5/air_pollution/history?lat=" +
            lat +
            "&lon=" +
            lon +
            "&start=" +
            start +
            "&end=" +
            end +
            "&appid=3e2d927d4f28b456c6bc662f34350957";
          fetch(url3)
            .then((res2) => {
              return res2.json();
            })
            .then((response2) => {
              let pm = response2.list[0].components.pm2_5;
              console.log(pm);
              var result = {
                array: dailyArray,
                pm25: pm,
                error: null,
              };
              res.send(result);
            });
        });
    })
    .catch((err) => {
      //catch for fetch 1, aiming to deal with typos
      console.log(err);
      var result = {
        array: null,
        pm25: null,
        error: true,
      };
      res.send(result);
    });
});

app.get("/api/", (req,res)=>{
  console.log(err);
      var result = {
        array: null,
        pm25: null,
        error: true,
      };
      res.send(result);
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

