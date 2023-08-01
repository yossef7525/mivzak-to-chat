import axios from "axios";
import fetch from "node-fetch";

const url = "https://www.oref.org.il/WarningMessages/alert/alerts.json";
const DEMO = false;
let prevId = "";

setInterval(() => {
  axios
    .get(url, {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Referer: "https://www.oref.org.il/12481-he/Pakar.aspx",
      },
      maxContentLength: Infinity,
    })
    .then((res) => {
        
      if (res.data !== "" && res.data.constructor === Object) {
        let json = JSON.parse(JSON.stringify(res.data));

        if (json.id != prevId) {
          prevId = json.id;

          let locations = "";

          for (let i = 0; i < json.data.length; i++) {
            locations += json.data[i] + " ";
          }
          const text = { text: `🚨🚀🚨🚀🚨\n ${json.title} \n ביישובים: ${locations},\n ${jsonData.desc}\n 🚨🚀🚨🚀🚨` };
          webhook(JSON.stringify(text))
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}, 500);

if (DEMO) {
    const jsonData = {
        "id": "133281935730000000",
        "cat": "1",
        "title": "בדיקה - ירי רקטות וטילים",
        "data": [
            "בת-ים",
            "פלמחים",
            "ראשון לציון - מערב",
            "תירוש"
        ],
        "desc": "זוהי אינה התראה אמיתית"
    };
    let locations = "";

    for (let i = 0; i < jsonData.data.length; i++) {
      locations += jsonData.data[i] + " ";
    }
    const text = { text: `🚨🚀🚨🚀🚨 \n בדיקה בדיקה בדיקה \n${jsonData.title} \n ביישובים: ${locations},\n ${jsonData.desc} \n 🚨🚀🚨🚀🚨` };
   setTimeout(()=> {

       webhook(JSON.stringify(text))
    },2000)
    }


async function webhook(dataForSend) {
    const webhookURL = `${process.env.RED_URL}`
  
    let resp;
    fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: dataForSend,
    }).then((response) => {
      resp = response;
    });
  }