import app from "./app.js";
import dotenv from "dotenv";
import { dbConnection } from "./db/db.connection.js";

// --------- dotenv config ----------
dotenv.config();

// ---------- database connection ----------
dbConnection();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
