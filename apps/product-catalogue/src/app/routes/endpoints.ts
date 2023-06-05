import fastify from 'fastify';
import {client} from 'pg'
const app = fastify()

interface Product{

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

const database:Product[] = []
//app.register(require())
app.get('/',(req,res)=>{
    res.send("hellloo")
})

//Create Product - POST
app.post('/product/create',(req,res)=>{
    let data:Product = req.body as Product
    console.log(data)
    database.push(data)
    res.send("Product created successfully")
})
//Create Product - GET
app.get('/product/create',(req,res)=>{
    
    res.send(database)
    
})

app.listen({port:4000},(err)=>{
    if (err) throw err
    console.log("server is listening....")
})



