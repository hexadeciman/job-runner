import "dotenv/config";
import express from "express";
import cors from "cors";
import { APP_PORT } from "./config/app";
import { botGroupPhotoTest, botMessageTest, botPhotoTest, addRowToSearch } from "./routes";
import { pingPlatform1 } from "./routes/platform1";
import { pingPlatform2 } from "./routes/platform2";
import { pingPlatform3 } from "./routes/platform3";
import { pingPlatform4 } from "./routes/platform4";

// Express Setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// entry point for curl + cron job
app.get("/ping", async (req, res) => {
  const platform = req.query.platform;
  if ( platform === "1" ) {
    const data = await pingPlatform1();
  }
  if ( platform === "2" ) {
    const data = await pingPlatform2();
  }
  if ( platform === "3" ) {
    const data = await pingPlatform3();
  }
  if ( platform === "4" ) {
    const data = await pingPlatform4();
  }
  res.json(platform);
});

/*--------- TEST ENDPOINTS ---------*/
// adds 
app.get("/addTestMatch", async (req, res) => {
  const data = await addRowToSearch();
  res.json(data);
});
// Sends a message to the telegram group
app.get("/sendTestNotification", async (req, res) => {
  const data = await botMessageTest();
  res.json(data);
});
// Sends 1 photo to the telegram group
app.get("/sendPhotoNotification", async (req, res) => {
  const data = await botPhotoTest();
  res.json(data);
});
// Sends group photos to the telegram group
app.get("/sendGroupPhotoNotification", async (req, res) => {
  const data = await botGroupPhotoTest();
  res.json(data);
});


// Default Route
app.get("/", async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
      res.send(healthcheck);
  } catch (error) {
      healthcheck.message = error;
      res.status(503).send();
  }
});

app.listen(APP_PORT, () => {
  console.log(`listening on port:${APP_PORT}`);
});