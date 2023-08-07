const express = require('express');
const app = express();

const port = 3000; // Choose any available port

app.get('/auth/callback', (req, res) => {
  // Handle the callback URL here after the user grants consent
  // The OAuth code will be available in req.query.code
  // Process the code to obtain the access token
  res.send('Authorization successful. You can close this window.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
