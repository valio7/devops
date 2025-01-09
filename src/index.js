import express from "express"
import dotenv from "dotenv"

const app = express()

app.get('/', async (_req, res) => {
    res.status(200).json("Hello, world!");
});

dotenv.config()
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running`)
})