import express from 'express';
import cors from 'cors';
import db from './db.js'; 

const server = express();
server.use(express.json());
server.use(cors());

const port = 5009;

server.get("/", (req, res) => {
    res.send("server!");
});

server.get("/api/getProducts", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).send("Database error: " + error.message);
    }
});

server.post("/api/addProduct", async (req, res) => {
    const { name, price, description, image } = req.body;
    if (!name || !price || !description) {
        return res.status(400).send("Required fields are missing");
    }
    const img = image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s";
    try {
        const result = await db.query(
            "INSERT INTO products (name, price, description, image) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, price, description, img]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).send("Database error: " + error.message);
    }
});

server.delete("/api/deleteProduct/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.query("DELETE FROM products WHERE id = $1", [id]);
        res.status(200).send("Product deleted successfully");
    } catch (error) {
        res.status(500).send("Database error: " + error.message);
    }
});

server.put("/api/updateProduct/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, description, image } = req.body;
    if (!name || !price || !description) {
        return res.status(400).send("Required fields are missing");
    }
    try {
        const result = await db.query(
            "UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5 RETURNING *",
            [name, price, description, image || "", id]
        );
        if (result.rowCount === 0) {
            return res.status(404).send("Product not found");
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send("Database error: " + error.message);
    }
});

server.listen(port, () => {
    console.log(`Server is Working on port ${port}`);
});
