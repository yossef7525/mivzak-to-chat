import fetch from "node-fetch";
import { parse } from "node-html-parser";
let lastData = {text: ''};

async function fetchText() {
  try {
    
    const page = await fetch("https://hm-news.co.il/news-flash/");
    const text = await page.text();
    const root = parse(text);
    const fleshs = root.querySelectorAll("article .elementor-widget-heading .elementor-heading-title.elementor-size-default a").flatMap((e) => {
      return { text: e.innerText + ' (המחדש) \r ' + e.attributes['href'] };
    });
    if (lastData.text != fleshs[1].text) {
      console.log(lastData ,fleshs[1]);
      webhook(JSON.stringify(fleshs[1]));
    }
    lastData = fleshs[1];
  } catch (error) {
    // throw error;
  }
}

(async function run(){
  for (let index = 0; index < 1; index) {
   await fetchText();  
  }
 })();

async function webhook(dataForSend) {
  const webhookURL =
    "https://chat.googleapis.com/v1/spaces/AAAAQlsmx_o/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=3waUBCO63X5elY8PpUFVGRI1u8YbsWCRNe5nSkM5EPo";

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

