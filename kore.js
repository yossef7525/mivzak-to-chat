import fetch from "node-fetch";
import { parse } from "node-html-parser";
let lastData = {text: ''};

async function fetchText() {
  try {
    
    const page = await fetch("https://www.kore.co.il/flashNews");
    const text = await page.text();
    const root = parse(text);
    const fleshs = root.querySelectorAll(".flash").flatMap((e) => {
      return { text: e.innerText + ' (כל רגע)' };
    });
    if (lastData.text != fleshs[0].text) {
      console.log(lastData ,fleshs[0]);
      webhook(JSON.stringify(fleshs[0]));
    }
    lastData = fleshs[0];
  } catch (error) {
    
  }
  }
  
  (async function run(){
    for (let index = 0; index < 1; index) {
     await fetchText();  
    }
   })();

async function webhook(dataForSend) {
  const webhookURL = `${process.env.CHAT_URL}`

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

