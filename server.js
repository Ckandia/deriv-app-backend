import express from "express";
import cors from "cors";
import WebSocket from "ws";

const app = express();
app.use(cors());

const DERIV_TOKEN = "1C23qDvmR9JjMC3";

app.get("/api/balance", async (req, res) => {
  const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

  ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: DERIV_TOKEN }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.toString());

    if (data.msg_type === "authorize") {
      ws.send(JSON.stringify({ balance: 1 }));
    }

    if (data.msg_type === "balance") {
      ws.close();
      res.json({ balance: data.balance });
    }
  };

  ws.onerror = () => {
    res.json({ balance: "error" });
  };
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
