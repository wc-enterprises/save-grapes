import fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { Client } from 'pg';
import validation from './validation_main';

const app = fastify();

//Database connection
const connectionString = 'postgres://postgres:12345@localhost/billing';
const client = new Client(connectionString);


interface Product {
  id: string;
  merchantId: string;
  productCatalogueId: string;
  name: string;
  price: number;
  tax: number;
  description?: string;
  discount?: number;
  brand?: string;
}

const database: Product[] = [];



function _validateCreateProductInput(data: Omit<Product, 'id'>) {
  //Mandatory param validation.
  validation.mandatoryParamCheck(data)
  validation.merchantId(data.merchantId)
  validation.productCatalogueId(data.productCatalogueId)
  validation.name(data.name)
  validation.price(data.price)
  validation.tax(data.tax)
  validation.description(data.description)
  validation.discount(data.discount)
  validation.brand(data.brand)
  
}

async function createProduct(req,res) {

  try {
    const data: Omit<Product, 'id'> = req.body as Omit<Product, 'id'>;

    _validateCreateProductInput(data);

    const id = `p_${uuidv4()}`;
    const newProduct = { ...data, id };

    const query = `insert into listofproducts ( id, merchantid, productcatalogueid, name, price, tax, description, discount, brand)
                values ( $1, $2, $3, $4, $5, $6, $7, $8, $9);`

    const values = [
    newProduct.id,
    newProduct.merchantId,
    newProduct.productCatalogueId,
    newProduct.name,
    newProduct.price,
    newProduct.tax,
    newProduct.description || null,
    newProduct.discount || null,
    newProduct.brand || null
  ]

  await client.query(query,values)
  database.push(newProduct);

  res.status(200).send({
    status: 'SUCCESS',
    data: {
      productId: id,
    },
    message:'Stored in database'
  });
  } 
  catch (err) {
    console.log(
      'Errored in create product input validation with message',
      err.message
    );
    res.status(400).send({
      status: 'ERROR',
      message: err.message,
    });
  }
}


async function getAllProducts(req,res) {
  try{
    const listofproducts = await client.query(`select * from listofproducts`)

    res.status(200).send({
       status:'SUCCESS',
       listofproducts
    });
  }
  catch(err){
    console.log('Error in retrieving',err)
    res.status(500).send({
       status:'FAILED',
       message:"Error in retrieving"
    })
  }
}



//Create Product - POST
app.post('/product/create', createProduct)

//Create Product - GET
app.get('/product/create', getAllProducts)


const start = async ()=>{
    try {
      await client.connect()
      console.log("Database connected")

      await app.listen({port:4000})
      console.log("Server is listening...")
    }
    catch (err){
      console.log('Failed to start server',err)
      process.exit(1)
    }
}

start()
//----------------------------------------------------------------
