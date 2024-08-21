import express from "express";
import user from "./routes/user";
import { AppDataSource } from "./datasource";
import "reflect-metadata";

// Connect to DB
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

// Create an Express application
const app = express();
app.use(express.json());
// Set the port number for the server
const port = 3000;

app.use("/user", user);
// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});
