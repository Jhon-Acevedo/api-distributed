import express from 'express';

const app = express();
app.use(express.json());

// TODO: create port in environment variables
const PORT = 3000

app.get('/ping', (req, res) => {
    res.send('pong');
    console.log("pong")
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})