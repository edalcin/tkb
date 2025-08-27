import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// API routes
app.get('/api/hello', (req, res) => {
  res.send('TKB Backend is running!');
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '..', 'frontend-build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend-build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
