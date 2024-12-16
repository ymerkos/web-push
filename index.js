//B"H
// Import the web-push library
const webPush = require("web-push");
const http = require("http");
var vapidKeys = {
	"publicKey": "BMFDU3eBLj5pJKRz9lTkadYlfURJRHs0lEe8QB1aMY8yyoS5VhpB9w76b71hrykAxDwOZEFPMj5zglw6HB9uYDI",
	"privateKey": "TkHTAHUVUFhsG2FLQbuocUtDKENtZ3Lv7OXn-grfxR8"
}
var VAPID_PUBLIC_KEY = vapidKeys.publicKey;
var VAPID_PRIVATE_KEY = vapidKeys.privateKey;

// Configure VAPID details for web-push
webPush.setVapidDetails(
  "https://awtsmoos.com/",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const PORT = 3000

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/vapidPublicKey") {
    // Return the VAPID public key
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(VAPID_PUBLIC_KEY);
  } else if (req.method === "POST" && req.url === "/register") {
    // Handle subscription registration (not stored in this example)
    res.writeHead(201);
    res.end("Subscription registered successfully.");
  } else if (req.method === "POST" && req.url === "/sendNotification") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const { subscription, payload, ttl, delay } = JSON.parse(body);
        const options = { TTL: ttl };

        setTimeout(() => {
          webPush
            .sendNotification(subscription, payload, options)
            .then(() => {
              res.writeHead(201);
              res.end("Notification sent successfully.");
            })
            .catch((error) => {
              console.error("Notification error:", error);
              res.writeHead(500);
              res.end("Failed to send notification.");
            });
        }, (delay || 0) * 1000);
      } catch (error) {
        console.error("Invalid request body:", error);
        res.writeHead(400);
        res.end("Invalid request body");
      }
    });
  } else {
    // Handle unknown routes
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`B"H
  
  Server is running on http://localhost:${PORT}`);
});
