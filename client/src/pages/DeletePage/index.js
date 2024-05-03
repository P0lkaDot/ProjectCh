import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import axios from 'axios'
export default function DeletePage () {
  const [receipt, setReceipt] = useState(null)
  const [selectedReceipt, setSelectedReceipt] = useState('')
  useEffect(() => {
    axios
      .get('http://localhost:5000/receipt')
      .then(({ data }) => {
        setReceipt(data.rows)
        setSelectedReceipt(data.rows[0].receipt)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  function handleReceipt ({ target }) {
    setSelectedReceipt(target.value)
  }

  function handleDeleteReceipt () {
    let userData = {
      id: receipt.find(element => element.receipt === selectedReceipt).id
    }
    const tmp = receipt.filter(item => item.id !== userData.id);
    setReceipt(tmp)
    axios
      .post('http://localhost:5000/receipt/delete', userData)
      .then(response => {
        console.log('Succ')
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  return (
    <main>
      <div className={styles.container}>
        <select value={selectedReceipt} onChange={handleReceipt}>
          {receipt &&
            receipt.map((option, index) => (
              <option key={index} value={option.receipt}>
                {option.receipt}
              </option>
            ))}
        </select>
      </div>
      <div className={styles.knopka}>
        <button onClick={handleDeleteReceipt}>Видалити</button>
      </div>
    </main>
  )
}
