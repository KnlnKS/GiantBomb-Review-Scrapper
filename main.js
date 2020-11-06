import fetch from "node-fetch";
import createCsvWriter from "csv-writer";
import APIKEY from "./secret.js";

const FORMAT = "format=json";
const OFFSET = "offset=";
const URL = "https://www.giantbomb.com/api/user_reviews/?";
const DATASIZE = 300
const DELAY = 2000
const SETTINGS = { method: "Get" };



var csvWriter = createCsvWriter.createObjectCsvWriter({
  path: "./export/reviewData.csv",
  header: [
    { id: "user", title: "user" },
    { id: "gameID", title: "game_id" },
    { id: "gameURL", title: "game_url" },
    { id: "gameName", title: "game_name" },
    { id: "score", title: "score" },
    { id: "dateAdded", title: "date_added" },
    { id: "dateUpdated", title: "date_updated" },
  ],
});

function checkValid(json, key) {
  if (json != undefined) return key in json;
  return false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getDatasets() {
  for (var i = 0; i < DATASIZE; i++) {
    var entries = [];

    fetch(URL + APIKEY + "&" + FORMAT + "&" + OFFSET + (i * 100), SETTINGS)
      .then((res) => res.json())
      .then((json) => {
        json.results.forEach((review) => {
          entries.push({
            user: review.hasOwnProperty("reviewer") ? review.reviewer : "",
            gameID: checkValid(review.game, "id") ? review.game.id : "",
            gameURL: checkValid(review.game, "site_detail_url")
              ? review.game.site_detail_url
              : "",
            gameName: checkValid(review.game, "name") ? review.game.name : "",
            score: review.hasOwnProperty("score") ? review.score : "",
            dateAdded: review.hasOwnProperty("date_added")
              ? review.date_added
              : "",
            dateUpdated: review.hasOwnProperty("date_last_updated")
              ? review.date_last_updated
              : "",
          });
        });

        csvWriter.writeRecords(entries).then(() => {
          if (entries.length>10) console.log((i*100 + 100)+" entries read.");
          else break;
        });
      });

    await sleep(DELAY);
  }
}


getDatasets();


