import express from 'express';
import { createServer } from "http";
import Product from './classes/product.js';
import Message from "./classes/message.js";
import Container from "./classes/container.js"
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';


// const tempContainer = new Container("products.txt");
// const random = require('random');
const app = express();
const { Router } = express;
const routerProducts = Router();
const httpServer = createServer(app);
const io = new Server(httpServer);
const container = new Container('messages.txt');

app.use('/api/products', routerProducts);
app.use(express.static('public'))

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

let products = [];
let messages = [];


//WEBSOCKET
io.on('connection', function(socket) {
  console.log('client conected');
  socket.emit('products', products); 
  socket.emit('messages', messages); 

  socket.on('new-product', function(data) {
    products.push(data);
    io.sockets.emit('products', products); 
  });    

  socket.on('new-message', function(data) {
    messages.push(data);
    container.save(new Message(data.email, data.dateTime, data.text))
    io.sockets.emit('messages', messages); 
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

routerProducts.delete('/:id', async (req, res) => {
  const product = products.find(x => x.id === parseInt(req.params.id));

  if(product) {
    products = products.filter(x => x.id !== product.id);

    return res.json(product);
  }

  return res.json({error: "404 product not found for delete"});
})

function getId() {
  const ids = products.map((product) => product.id);

  return ids.length > 0 ? Math.max(...ids) : 0;
}

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})