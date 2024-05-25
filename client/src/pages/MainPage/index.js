import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './styles.module.css'

export default function MainPage () {
  const [data, setData] = useState(null)
  const [sklad, setSklad] = useState(null)
  const [receipts, setReceipts] = useState([])
  useEffect(() => {
    axios
      .get('http://localhost:5000/receipt')
      .then(({ data }) => {
        setData(data.rows)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:5000/sklad')
      .then(({ data }) => {
        setSklad(data.rows)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const calculateMaxRecipes = (recipe, sklad) => {
    const necessaryProducts = Object.entries(recipe).filter(
      ([key]) => key !== 'receipt'
    )

    const skladMap = sklad.reduce((acc, { productid, quantity }) => {
      acc[productid] = quantity
      return acc
    }, {})

    let maxRecipes = Infinity

    for (const [id, count] of necessaryProducts) {
      const available = skladMap[id]
      if (available === undefined) {
        return 0
      }
      maxRecipes = Math.min(maxRecipes, Math.floor(available / count))
    }
    return maxRecipes
  }

  const addReceipt = newReceipt => {
    setReceipts(prevReceipts => [...prevReceipts, newReceipt])
  }

  useEffect(() => {
    if (data && sklad) {
      data.forEach(element => {
        const str = element.idproductsandvalues.replace(/\s+/g, '')
        let recipeParts = str.split(',')
        const recipe = recipeParts.reduce((acc, part) => {
          const [id, count] = part.split(':')
          acc[id] = parseInt(count, 10)
          return acc
        }, {})
        recipe.receipt = element.receipt
        recipe.maxQuantity = calculateMaxRecipes(recipe, sklad)
        addReceipt(recipe)
      })
    }
  }, [data, sklad])

  return (
    <main className={styles.main}>
      {receipts &&
        receipts.map((item, index) => (
          <div className={styles.mainTable} key={index}>
            <div className={styles.block}>{item.receipt}</div>
            <div className={styles.block}>{item.maxQuantity}</div>
          </div>
        ))}
    </main>
  )
}
