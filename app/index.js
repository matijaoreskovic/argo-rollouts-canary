const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        ">
            <span style="
                font-size: 48px;
                padding: 20px;
                background-color: red;
                color: white;
                text-align: center;
                border-radius: 8px;
            ">
                Red
            </span>
        </div>
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
