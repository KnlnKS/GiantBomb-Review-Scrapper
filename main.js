import fetch from "node-fetch";
import createCsvWriter from "csv-writer";
import APIKEY from "./secret.js";

const FORMAT = "format=json";
const OFFSET = "offset=";

var url = "https://www.giantbomb.com/api/user_reviews/?";
var offsetVal = 0;
var settings = { method: "Get" };
var entries = [];

function checkValid(json, key) {
  if (json != undefined) return key in json;
  return false;
}

fetch(url + APIKEY + "&" + FORMAT + "&" + OFFSET + offsetVal, settings)
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
        dateAdded: review.hasOwnProperty("date_added") ? review.date_added : "",
        dateUpdated: review.hasOwnProperty("date_last_updated")
          ? review.date_last_updated
          : "",
      });
    });

    var csvWriter = createCsvWriter.createObjectCsvWriter({
      path: "./export/reviewData" + offsetVal + ".csv",
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

    csvWriter.writeRecords(entries).then(() => {
      console.log("...Done");
    });
  });
