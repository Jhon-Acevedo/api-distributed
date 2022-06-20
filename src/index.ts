import express from 'express';

const app = express();
app.use(express.json());

// TODO: create port in environment variables
const PORT = 3000;

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
