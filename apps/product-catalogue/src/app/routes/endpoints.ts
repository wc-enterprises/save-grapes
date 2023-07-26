//import Fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import validation from './validation_main';

const app = require('fastify')();
//const app = Fastify();

app.register(require('@fastify/postgres'),{
  connectionString : 'postgres://postgres:12345@localhost/billing'
})


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

  await app.pg.query(query,values)
  database.push(newProduct);

  res.status(200).send({
    status: 'SUCCESS',
    data: {
      productId: id,
    },
    message:'Successfully stored in database'
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
    const listofproducts = await app.pg.query(`select * from listofproducts;`)
    const result = listofproducts.rows

    res.status(200).send({
       status:'SUCCESS',
       listofproducts:result
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

async function updateProduct(req,res) {
  try{
    const product_id = req.params.id

    const { 
      merchantId,
      productCatalogueId,
      name,
      price,
      tax,
      description,
      discount,
      brand
    } = req.body

    const values = [merchantId,productCatalogueId,name,price,tax,description,discount,brand,product_id]
    await app.pg.query(`update listofproducts
                        set merchantId = $1,productCatalogueId = $2,name = $3,price = $4,tax = $5,description = $6,discount = $7,brand = $8
                        where id = $9;`
                        ,values)

    res.status(200).send({
      status:'Successfully updated'
    })
  }
  catch(err){
    console.log("Failed with message",err.message)
    res.status(500).send({
      status:'FAILED'
    })
  }
}

async function deleteProduct(req,res) {
  try{
  const product_Id = req.params.id
  await app.pg.query(`delete from listofproducts where id = $1;`,[product_Id])

  res.status(200).send({
    status:"Successfully deleted"
  })
  }
  catch(err){
    console.log("Failed with message",err.message)
    res.status(500).send({
      status:"Failed"
    })
  }
}

//Create Product - POST METHOD 
app.post('/product/create', createProduct)

//Create Product - GET METHOD
app.get('/product/create', getAllProducts)

//PUT METHOD 
app.put('/product/update/:id', updateProduct )

// DELETE METHOD
app.delete('/product/delete/:id', deleteProduct)

const start = async ()=>{
    try {
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
