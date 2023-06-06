import fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';

const app = fastify();

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
//app.register(require())
app.get('/', (req, res) => {
  res.send('hellloo');
});

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
}

//Create Product - POST
app.post('/product/create', (req, res) => {
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
  const newProduct: Product = { ...data, id };
  database.push(newProduct);
  res.send({
    status: 'SUCCESS',
    data: {
      productId: id,
    },
  });
});

//Create Product - GET
app.get('/product/create', (req, res) => {
  res.send(database);
});

app.listen({ port: 4000 }, (err) => {
  if (err) throw err;
  console.log('server is listening....');
});
