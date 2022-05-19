import express from 'express';
import { createServer } from "http";
import Product from './classes/product.js';
import Message from "./classes/message.js";
import Container from "./classes/container.js"
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import {createProductsTable, createMessagesTable, KnexConfiguration} from './utils.js';
import {mySqlDatabase, sqlLite3Database} from './config/configuration.js';
import { faker } from '@faker-js/faker';
import {normalize, denormalize, schema} from 'normalizr';
faker.locale = 'es';



// const tempContainer = new Container("products.txt");
// const random = require('random');
const app = express();
const { Router } = express;
const routerProducts = Router();
const httpServer = createServer(app);
const io = new Server(httpServer);
const container = new Container('messages.txt');

app.use('/api/products', routerProducts);
app.use('/api/public', express.static('public'))

routerProducts.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine(
  "hbs",
  engine({
      extname: ".hbs",
      defaultLayout: 'index.hbs',
  })
);

app.set('views', './views');
// app.set('view engine', 'ejs');
app.set('view engine', 'hbs');
// app.set('view engine', 'pug');

const port = 8080;

// createProductsTable();
// createMessagesTable();
// const productsDbUtils = new KnexConfiguration(mySqlDatabase, 'products');
// const messagesDbUtils = new KnexConfiguration(sqlLite3Database, 'messages');

let mess = [];
let prods = [];


//WEBSOCKET
io.on('connection', function(socket) {
  console.log('client conected');
  socket.emit('messages', mess);
  // messagesDbUtils.getAll().then((messages)=>{
  //   mess = messages;
  //   socket.emit('messages', mess);
  // }).catch(error => console.log(error));
  socket.emit('products', prods);
  // productsDbUtils.getAll().then((products)=> {
  //   prods = products;
  //
  // }).catch(error => console.log(error));

  socket.on('new-product', function(data) {
    const product = new Product(undefined, data.title, data.price, data.thumbnails);
    io.sockets.emit('products', prods);
    // productsDbUtils.insertData(product).then(() => {
    //    io.sockets.emit('products', prods);
    // }).catch(error => console.log(error));
  });    

  socket.on('new-message', function(data) {
    const message = new Message(data.text, data.author);
    mess.push(message);
    const info = JSON.stringify(mess);
    console.log(JSON.parse(info));
    console.log(normalizeData(JSON.parse(info)));
    io.sockets.emit('messages', normalizeData(JSON.parse(info)));
    // messagesDbUtils.insertData(message).then(()=>{
    //   io.sockets.emit('messages', mess);
    // }).catch(error => console.log(error));
  }); 
});




//TEMPLATES
app.get('/products', (req, res) => {

  res.render("view");
});

app.post('/products', (req, res) => {
  const id = getId();
  console.log(req.body);
  const product = new Product(id + 1, req.body.title, req.body.price, req.body.thumbnails);

  products.push(product);
  res.redirect('/')
});


//FAKE
app.get('/api/products-test', (req, res) => {
  const products = createFakesProducts(CANT_PRODUCTS_DEFAULT);

  res.render("view", {products: products});
});

const CANT_PRODUCTS_DEFAULT = 5;

function createFakeProduct(id) {
  return new Product(id, faker.commerce.productName(), faker.finance.amount(), faker.image.image());
}

function createFakesProducts(cant) {
  const products = []
  for (let i = 0; i < cant; i++) {
    products.push(createFakeProduct(getId(products)))
  }
  return products
}


//API REST
routerProducts.get('/', async (req, res) => {
  if (products.length > 0) return res.json(products);

  res.json({error: "204 no content"});
});

routerProducts.get('/:id', async (req, res) => {
  const product = products.find(x => x.id === parseInt(req.params.id));

  if(product) return res.json(product);

  return res.json({error: "404 product not found"});
});

routerProducts.post('/', async (req, res) => {
  const id = getId();
  const product = new Product(id + 1, req.body.title, req.body.price, req.body.thumbnails);
  products.push(product);

  res.json(product);
});


//put != patch actualizo si esta sino creo nuevo
routerProducts.put('/:id', async (req, res) => {
  const product = products.find(x => x.id === parseInt(req.params.id));

  if(product){
    product.title = req.body.title;
    product.price = req.body.price;
    product.thumbnails = req.body.thumbnails;

    return res.json(product);
  }

  const id = getId();
  const newProduct = new Product(id + 1, req.body.title, req.body.price, req.body.thumbnails);
  products.push(newProduct);

  return res.json(newProduct);
})

// routerProducts.delete('/:id', async (req, res) => {
//   const product = products.find(x => x.id === parseInt(req.params.id));
//
//   if(product) {
//     products = products.filter(x => x.id !== product.id);
//
//     return res.json(product);
//   }
//
//   return res.json({error: "404 product not found for delete"});
// })

function getId(products) {
  const ids = products.map((product) => product.id);

  return ids.length > 0 ? Math.max(...ids) : 1;
}


//NORMALIZER

const authorSchema = new schema.Entity('author', {}, {idAttribute: 'email'});
const messageSchema = new schema.Entity('message', {
  author: authorSchema
});

const messageListSchema = new schema.Array(
    {
      messages: [messageSchema],
      id: 'messages'
    }
);

function normalizeData(data){
  return normalize(data, messageSchema);
}

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})