//B"H
// Import the web-push library
const webPush = require("web-push");
const http = require("http");

// Ensure VAPID keys are set in the environment
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables. Here are some generated keys:"
  );
  const keys = webPush.generateVAPIDKeys();
  console.log(`VAPID_PUBLIC_KEY: ${keys.publicKey}`);
  console.log(`VAPID_PRIVATE_KEY: ${keys.privateKey}`);
  process.exit(1);
}

// Configure VAPID details for web-push
webPush.setVapidDetails(
  "https://example.com/",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/vapidPublicKey") {
    // Return the VAPID public key
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(process.env.VAPID_PUBLIC_KEY);
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
