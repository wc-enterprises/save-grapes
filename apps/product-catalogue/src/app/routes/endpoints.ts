import fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { Client } from 'pg';
const app = fastify();

const connectionString = 'postgres://postgres:12345@localhost/billing';
const client = new Client(connectionString);

//Database connection

async function start(){
    try{
        await client.connect()
        console.log("Database connected")
    }
    catch(err){
        console.log('failed to connect',err)
    }
}

start()

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
  const missingParams = [];
  const mandatoryParams = [
    'merchantId',
    'productCatalogueId',
    'name',
    'price',
    'tax',
  ];
  mandatoryParams.forEach((mandatoryParam) => {
    const incomingKeys = Object.keys(data);
    if (!incomingKeys.includes(mandatoryParam)) {
      missingParams.push(mandatoryParam);
    }
  });
  if (missingParams.length) {
    throw new Error(`Mandatory params missing. ${missingParams.join(',')}`);
  }

  //Type validation.
  if (
    typeof data.merchantId !== 'string' ||
    typeof data.productCatalogueId !== 'string' ||
    typeof data.name !== 'string' ||
    typeof data.tax !== 'number' ||
    typeof data.price !== 'number'
  ) {
    throw new Error(`Invalid type.`);
  }

  if (data.description && typeof data.description !== 'string')
    throw new Error(`Invalid description type.`);
  if (data.brand && typeof data.brand !== 'string')
    throw new Error(`Invalid brand type.`);
  if (data.discount && typeof data.discount !== 'number')
    throw new Error(`Invalid discount type.`);

  //Length validation.

  if (data.name && (data.name.length<3 || data.name.length >30)){
    throw new Error(`Name length should be between 3 and 30 characters.`)
  }
  if (data.description && (data.description.length > 200)){
    throw new Error(`Description length should be less than 200 characters.`)
  }
  if (data.brand && (data.brand.length <3 || data.brand.length >30)){
    throw new Error(`Brand length should be between 3 and 30 characters.`)
  }
  if (data.price<0){
    throw new Error(`Price should be a positive value.`)
  }
  if (data.tax <0){
    throw new Error(`Tax should be a positive value.`)
  }

  
}

//Create Product - POST
app.post('/product/create', async (req, res) => {
  // Receive request body       
  const data: Omit<Product, 'id'> = req.body as Omit<Product, 'id'>;

  // Validate request body.
  try {
    _validateCreateProductInput(data);
    
  } catch (err) {
    console.log(
      'Errored in create product input validation with message',
      err.message
    );
    res.code(400).send({
      status: 'ERROR',
      message: err.message,
    });
  }

  const id = `p_${uuidv4()}`;
  const newProduct = { ...data, id };

  //Insertion of data in database
  try{
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
  res.code(200).send({
    status: 'SUCCESS',
    data: {
      productId: id,
    },
    message:'Stored in database'
  });
}
catch(err){
        console.log('Insertion of data in db is failed',err)
        res.code(400).send({
            status:'Failed',
            message:'Insertion of data in db is failed'
        })
}

});

//Create Product - GET
app.get('/product/create', async(req, res) => {

    try{
         const listofproducts = await client.query(`select * from listofproducts`)

         res.code(200).send({
            status:'SUCCESS',
            listofproducts
         });
    }
    catch(err){
        console.log('Error in retrieving',err)
        res.send({
            status:'FAILED',
            message:"Error in retrieving"
        })
    }
 
}); 

app.listen({ port: 4000 }, (err) => {
  if (err) throw err;
  console.log('server is listening....');
});

