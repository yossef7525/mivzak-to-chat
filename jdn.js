import fetch from "node-fetch";
import { parse } from "node-html-parser";
let lastData = {text: ''};

async function fetchText() {
  try {
    
    const page = await fetch("https://www.jdn.co.il/flash");
    const text = await page.text();
    const root = parse(text);
    const fleshs = root.querySelectorAll(".ue_post_blocks_title a").flatMap((e) => {
      return { text: e.innerText.replaceAll('&quot;', "''") + ' (JDN) \r ' + e.attributes['href'] };
    });
    if (lastData.text != fleshs[0].text) {
      console.log(lastData ,fleshs[0]);
      webhook(JSON.stringify(fleshs[0]));
    }
    lastData = fleshs[0];
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
  const webhookURL = `${process.env.JDN_URL}`

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

