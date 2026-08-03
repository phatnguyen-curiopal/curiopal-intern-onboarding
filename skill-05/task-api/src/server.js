require("dotenv").config();

const app = require("./app");
const pool = require("./db");

const PORT = Number(process.env.PORT) || 3000;

async function startServer () {
    try {
        const result = await pool.query('SELECT 1');
        console.log("Connected to MySQL");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (err) {
        console.log(err.message);
        process.exitCode = 1;
    }
}

startServer();