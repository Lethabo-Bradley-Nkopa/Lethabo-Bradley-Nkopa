import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());

app.all("/proxy", async (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.status(400).send("Missing url");
    }

    try {

        const response = await fetch(url, {
            method: req.method,
            headers: {
                ...req.headers,
                host: undefined
            },
            body: ["GET", "HEAD"].includes(req.method)
                ? undefined
                : JSON.stringify(req.body)
        });

        const text = await response.text();

        res.status(response.status).send(text);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server running on port", port);
});
