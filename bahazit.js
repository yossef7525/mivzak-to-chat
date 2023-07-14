import fetch from "node-fetch";
import { parse } from "node-html-parser";
let lastData = {text: ''};

async function fetchText() {
  try {
    
    const page = await fetch("https://www.bahazit.co.il/mivzakim/");
    const text = await page.text();
    const root = parse(text);
    const fleshs = { text: root.querySelector(".mivzak .mivzak_contant .contant").innerText.replaceAll('&quot;', "''") + (root.querySelector(".mivzak .mivzak_contant .button_bahazit").attributes['href'] ?  ' \r ' + root.querySelector(".mivzak .mivzak_contant .button_bahazit").attributes['href'] : '')}
    if (lastData.text != fleshs.text) {
      console.log(lastData ,fleshs);
      webhook(JSON.stringify(fleshs));
    }
    lastData = fleshs;
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
  const webhookURL = `${process.env.BAHAZIT_URL}`

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

