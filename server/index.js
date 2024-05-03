const express = require('express')
const app = express()
const port = 5000

const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'chefsupp',
  password: '1234',
  port: 5432
})

client.connect()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})
app.use(express.json())

app.get('/sklad', (req, res) => {
  client
    .query('SELECT * FROM sklad')
    .then(result => {
      res.send(result)
    })
    .catch(err => console.error('Error connecting to PostgreSQL database', err))
})
app.post('/sklad', async (req, res) => {
  try {
    const { name } = req.body
    const query = 'INSERT INTO sklad (productname) VALUES ($1) RETURNING *'
    const values = [name]
    const result = await client.query(query, values)
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).send('Error executing query')
  }
})
app.post('/sklad/quantity', async (req, res) => {
  try {
    const { id, quantity } = req.body
    const query = 'UPDATE sklad SET quantity = $2 WHERE productid = $1 RETURNING *'
    const values = [id, quantity]
    const result = await client.query(query, values)
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).send('Error executing query')
  }
})
app.post('/receipt/delete', async (req, res) => {
  const id = req.body.id;
  try {
    const queryText = 'DELETE FROM receipt WHERE id = $1';
    await client.query(queryText, [id]);
    res.send('Элемент успешно удален');
  } catch (error) {
    res.status(500).send('Ошибка при удалении элемента');
  }
});


app.get('/receipt', (req, res) => {
  client
    .query('SELECT * FROM receipt')
    .then(result => {
      res.send(result)
    })
    .catch(err => console.error('Error connecting to PostgreSQL database', err))
})

app.post('/receipt', async (req, res) => {
  try {
    const { name, products, calori } = req.body
    const query =
      'INSERT INTO receipt (receipt, idproductsandvalues, callori) VALUES ($1, $2, $3) RETURNING *'
    const values = [name, products, calori ]
    const result = await client.query(query, values)
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error executing query', err)
    res.status(500).send('Error executing query')
  }
})

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`)
})
