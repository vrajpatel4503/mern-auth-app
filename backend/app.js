import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ----- Routes import -----
import userRoutes from "./routes/user.routes.js"

const app = express();

// ------------------- middleware -------------------

// ------ cors -------

const corsOptions = {
  origin: "http://localhost:5173", // only allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // allowed HTTP methods
  credentials: true, // allow cookies, authorization headers
};

app.use(cors(corsOptions));

app.use(express.json()); // Parses incoming JSON payloads in req.body, useful for APIs receiving JSON data.

app.use(cookieParser()); // Parses cookies attached to the client request and makes them available under req.cookies.

app.use(express.urlencoded({ extended: true })); //Parses incoming requests with URL-encoded data (e.g., form submissions). The extended: true allows nested objects.


// -------- Routes declaration ---------
app.use("/api/v1/user", userRoutes)


app.get("/", (req, res) => {
  res.send("Backend is running...");
});

export default app;
