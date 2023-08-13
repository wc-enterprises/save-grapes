import Fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import validation from './validation_main';
import { PrismaClient } from '@prisma/client'
//const app1 = require('fastify')();
const app:any = Fastify();
const prisma = new PrismaClient()


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


function _validateCreateProductInput(data: Omit<Product, 'id'>) {
  //Mandatory param validation.
  
  validation.mandatoryParamCheck(data)
  validation.merchantId(data.merchantId)
  validation.productCatalogueId(data.productCatalogueId)
  
  validation.price(data.price)
  validation.tax(data.tax)
  if(data.name)
    validation.name(data.name)
  if(data.description)
    validation.description(data.description)
  if(data.discount)
    validation.discount(data.discount)
  if(data.brand)
    validation.brand(data.brand) 
}

async function createProduct(req,res) {

  try {
    const data: Omit<Product, 'id'> = req.body as Omit<Product, 'id'>;

    _validateCreateProductInput(data);

    const id = `p_${uuidv4()}`;
    const newProduct = { ...data, id };

  
   await prisma.listofproducts.create({
    data: {
      id: newProduct.id,
      merchantid: newProduct.merchantId,
      productcatalogueid: newProduct.productCatalogueId,
      name: newProduct.name,
      price: newProduct.price,
      tax: newProduct.tax,
      description: newProduct.description || null,
      discount: newProduct.discount || null,
      brand: newProduct.brand || null,
    },
  });

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
    
    const listofproducts= await prisma .listofproducts.findMany()
    const result = listofproducts

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
                 
      await prisma.listofproducts.update({
        where: {
          id: product_id,
        },
        data: {
          merchantid : merchantId,
          productcatalogueid : productCatalogueId,
          name : name,
          price : price,
          tax : tax,
          description: description || null,
          discount: discount || null,
          brand: brand || null,
        },
      });

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
  
  await prisma.listofproducts.delete({
    where: {
      id: product_Id,
    },
  });

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
