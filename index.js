import express from "express";
import { exec } from "child_process";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/", (req, res) => {
    res.send("Hello! The server is running.");
})

// Mock API endpoint
app.post("/mock/get-product-attribute", (req, res) => {
  console.log("Received request at /mock/get-product-attribute");
  const token = req.headers["token"];
  const { product_id } = req.body;
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);

  const curlCmd = `curl --location 'https://codingincloud.com/marketplace_us/api/get-product-attribute' \
    --header 'Token: ${token}' \
    --header 'Content-Type: application/json' \
    --data '{\"product_id\":${product_id}}'`;

  console.log("Executing curl command:", curlCmd);

  exec(curlCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("Curl error:", error);
      return res.status(500).json({ error: "Curl request failed" });
    }
    if (stderr) {
      console.warn("Curl stderr:", stderr);
    }
    console.log("Curl stdout:", stdout);
    try {
      const json = JSON.parse(stdout);
      console.log("Parsed JSON response:", json);
      res.json(json);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      res.send(stdout);
    }
  });
});

app.listen(PORT, () => {
  console.log(`HTTP Express server running at http://localhost:${PORT}`);
});
