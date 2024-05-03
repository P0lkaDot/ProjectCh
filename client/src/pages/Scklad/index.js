import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './styles.module.css'

function Sklad () {
  const [product, setProduct] = useState('')
  const [data, setData] = useState(null)
  const [quintity, setQuintity] = useState('')
  useEffect(() => {
    axios
      .get('http://localhost:5000/sklad')
      .then(({ data }) => {
        setData(data.rows)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  function handleChangeProduct (event) {
    setProduct(event.target.value)
  }
  function handleChangeQuintity (event) {
    setQuintity(event.target.value)
  }
  function handleSubmit () {
    let idProduct = -1
    data.forEach(element => {
      if (element.productname === product) {
        {
          idProduct = element.productid
        }
      }
    })

    if (idProduct === -1) {
      let userData = {
        name: product
      }
      axios
        .post('http://localhost:5000/sklad', userData)
        .then(response => {
          setData([...data, response.data])
          let userData = {
            id: response.data.productid,
            quantity: quintity
          }
          axios
            .post('http://localhost:5000/sklad/quantity', userData)
            .then(response => {
              console.log('Succ', response.data)
            })
            .catch(error => {
              console.error('Error:', error)
            })
        })
        .catch(error => {
          console.error('Error:', error)
        })
    } else {
      let userData = {
        id: idProduct,
        quantity: quintity
      }
      axios
        .post('http://localhost:5000/sklad/quantity', userData)
        .then(response => {
          console.log('Succ', response.data)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  }
  return (
    <main>
      <div className={styles.container}>
        <div className={styles.row}>
          <label htmlFor='productName'>Product:</label>
          <input
            placeholder='productName'
            value={product}
            onChange={handleChangeProduct}
          />
          <label htmlFor='quantity'>Quantity:</label>
          <input
            placeholder='quintity'
            value={quintity}
            onChange={handleChangeQuintity}
          />
        </div>

        <div className={styles.row}>
          <button onClick={handleSubmit} type='submit'>
            Submit
          </button>
        </div>
      </div>
    </main>
  )
}

export default Sklad
