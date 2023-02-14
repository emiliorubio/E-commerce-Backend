const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();
const port = 8080;

// products endpoint
const productsRouter = express.Router();
const productsPath = path.join(__dirname, 'products.json');
let products = [];
fs.readFile(productsPath, (error, data) => {
  if (error) throw error;
  products = JSON.parse(data);
});

productsRouter
  .route('/')
  .get((request, response) => {
    response.send(products);
  });

app.use('/products', productsRouter);

// carts endpoint
const cartsRouter = express.Router();
const cartsPath = path.join(__dirname, 'carts.json');
let carts = [];
fs.readFile(cartsPath, (error, data) => {
  if (error) throw error;
  carts = JSON.parse(data);
});

const writeToFile = (filePath, data) => {
  fs.writeFile(filePath, JSON.stringify(data), error => {
    if (error) throw error;
  });
};

cartsRouter
  .route('/')
  .post((request, response) => {
    const newCart = { id: carts.length + 1, products: [] };
    carts.push(newCart);
    writeToFile(cartsPath, carts);
    response.send(newCart);
  });

cartsRouter
  .route('/:id')
  .get((request, response) => {
    const id = parseInt(request.params.id);
    const cart = carts.find(c => c.id === id);
    response.send(cart);
  })
  .post((request, response) => {
    const id = parseInt(request.params.id);
    const cart = carts.find(c => c.id === id);
    const productId = request.body.productId;
    const product = products.find(p => p.id === productId);
    if (cart && product) {
      cart.products.push(product);
      writeToFile(cartsPath, carts);
      response.send(cart);
    } else {
      response.status(400).send({ error: 'producto no encontrado' });
    }
  });

app.use('/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor E-commerce en el puerto http://localhost:${port}`);
});