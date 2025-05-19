import express from 'express';
import cors from 'cors';

const server = express();
server.use(express.json())
server.use(cors());

const port = 5009;

let products = [];
  
  server.get("/", (req, res) => {
    res.send("server!");
  });
  
  server.get("/api/getProducts", (req, res) => {
    res.send(products);
  });
  
  server.post("/api/addProduct", (req, res) => {
    const { name, price, description } = req.body;
    let image = req.body.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s";
    if (!name || !price || !description) {
      return res.status(400).send("required fields are missing");
    }
    const newProduct = {
      id: new Date().getTime(), // Unique ID based on timestamp
      name,
      price,
      description,
      image,
    };
    products.push(newProduct);
    res.status(201).send("product added :", newProduct);
  });
  
  server.delete("/api/deleteProduct/:id", (req, res) => {
    let id = req.params.id;
  
    products = products.filter((product) => product.id !== parseInt(id));
    res.status(200).send("Product deleted successfully");
  })

  server.put("/api/updateProduct/:id", (req, res) => {
    const { name, price, description } = req.body;
    const id = parseInt(req.params.id);
    let image = req.body.image || "";
    if (!name || !price || !description) {
      return res.status(400).send("required fields are missing");
    }
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return res.status(404).send("Product not found");
    }
    products[productIndex] = { id, name, price, description, image };
    res.status(200).send("Product updated successfully");
  });
  


server.listen(port , () => {
    console.log(`Server is Working ${port}`)

})

