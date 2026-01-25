import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import errResponse from "./middlewares/err_response.js";
import authRoute from "./routes/auth_route.js";
import userRoute from "./routes/user_route.js";
import postRoute from "./routes/post_route.js";
import chatRoute from "./routes/chat_route.js";
import msgRoute from "./routes/msg_route.js";
import quoteApi from "./api/quote.api.js";
import cloudinary from "cloudinary";
import http from "http";
import { initSocket } from "./socket/socket.js";

// app config
const app = express();
const port = process.env.port || 5000;

// database connection
import connectDB from "./config/db.js";
connectDB();

// middlewares
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// root route to show welcome message
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Cnectify!</h1>
    <p>Your server is up and running 🚀</p>
  `);
});

// routes
app.use(authRoute);
app.use(userRoute);
app.use(postRoute);
app.use(chatRoute);
app.use(msgRoute);

// api
quoteApi(app);

// error handling middleware
app.use(errResponse);

// cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

// create server & initialize socket
const server = http.createServer(app);
initSocket(server);

// mysql db connection
import { connectMySQL } from "./config/mysql-db.js";
connectMySQL();

// listen
server.listen(port, (req, res) => {
  console.log(`server is running at ${port}`);
});
