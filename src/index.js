async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes("application/text")) {
    return request.text();
  } else if (contentType.includes("text/html")) {
    return request.text();
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    return "a file";
  }
}

async function handleRequestStart(request) {
  const reqBody = await readRequestBody(request);
  const messageObj = JSON.parse(reqBody)["message"];
  if (!messageObj?.["text"]) {
    return new Response("OK");
  }
  if (JSON.stringify(messageObj["text"]).includes("/start")) {
    const bot_token = BOT_TOKEN;
    const bot_url = "https://api.telegram.org/bot" + bot_token + "/sendMessage";
    const messageSend = JSON.stringify({
      chat_id: messageObj["chat"]["id"],
      text: `Welcome, your ID is ${messageObj["chat"]["id"]}`,
    });
    try {
      let response = fetch(bot_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: messageSend,
      });
      return await response;
    } catch (error) {
      return new Response("Error when sending notification");
    }
  } else {
    return new Response("Ok");
  }
}

async function handleRequestSend(request) {
  console.log(request);
  const reqBody = await readRequestBody(request);
  const messageObj = JSON.parse(reqBody);
  const bot_token = BOT_TOKEN;
  const bot_url = "https://api.telegram.org/bot" + bot_token + "/sendMessage";
  console.log(messageObj);
  const messageSend = JSON.stringify({
    chat_id: messageObj["chat_id"],
    text: messageObj["text"],
  });
  try {
    let response = fetch(bot_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: messageSend,
    });
    return await response;
  } catch (error) {
    return new Response("Error when sending notification");
  }
}

addEventListener("fetch", (event) => {
  const { request } = event;
  const { url } = request;

  if (url.includes("send")) {
    return event.respondWith(handleRequestSend(request));
  }
  if (url.includes("newMessage")) {
    try {	
      return event.respondWith(handleRequestStart(request));
    } catch (e) {
      return Response("Ok");
    }
  }
  if (request.method === "POST") {
    return event.respondWith(new Response("Ok"));
  } else if (request.method === "GET") {
    return event.respondWith(new Response("Ok"));
  }
});
