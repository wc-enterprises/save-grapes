const fastify = require('fastify')
const app = fastify()

const database = []
//app.register(require())
app.get('/',(req,res)=>{
    res.send("hellloo")
})

//Create Product - POST
app.post('/product/create',(req,res)=>{
    const data = req.body
    console.log(data)
    database.push(data)
    res.send("Product created successfully")
})
//Create Product - GET
app.get('/product/create',(req,res)=>{
    
    database.forEach((obj)=>{
            res.send(obj)
    })
})

app.listen({port:3000},(err)=>{
    if (err) throw err
    console.log("server is listening....")
})



