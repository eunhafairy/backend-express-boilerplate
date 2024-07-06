// Import the 'express' module
import express from 'express';
import user from './routes/user'
// Create an Express application
const app = express();

// Set the port number for the server
const port = 3000;

app.use('/user', user)
// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});