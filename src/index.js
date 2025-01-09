import express from "express"

const app = express()

app.get('http://localhost:3000/config', async (_req, res) => {
    res.status(200).json("Hello, world!");
});

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})