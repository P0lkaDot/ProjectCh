import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import axios from 'axios'

export default function NewReceipts () {
  const [receipt, setReceipt] = useState('')
  const [sklad, setSklad] = useState(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [quintity, setQuintity] = useState(0)
  const [calori, setCalori] = useState(0)
  const [info, setInfo] = useState('')
  const [result, setResult] = useState('')
  useEffect(() => {
    axios
      .get('http://localhost:5000/sklad')
      .then(({ data }) => {
        setSklad(data.rows)
        setSelectedOption(data.rows[0].productname)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])
  const handleSelectChange = event => {
    setSelectedOption(event.target.value)
  }
  function handleReceipt ({ target }) {
    setReceipt(target.value)
  }
  function handleQuntity ({ target }) {
    setQuintity(parseInt(target.value))
  }
  function handleCalori ({ target }) {
    setCalori(parseInt(target.value))
  }

  useEffect(() => {
    let lastIndex = result.lastIndexOf(',')
    let str = result
    if (lastIndex !== -1) {
      str = str.substring(0, lastIndex)
    }
    const parts = str.split(',')
    let tmp = ''
    if (sklad) {
      parts.forEach(element => {
        tmp +=
          sklad.find(
            sklElem =>
              parseInt(element.split(':')[0].trim()) === sklElem.productid
          ).productname +
          ' - ' +
          element.split(':')[1].trim() +
          'g\n'
      })
      setInfo(tmp)
    }
  }, [result])

  function handleSubmit () {
    let lastIndex = result.lastIndexOf(',')
    let str = result
    if (lastIndex !== -1) {
      str = str.substring(0, lastIndex)
    }
    let userData = {
      name: receipt, 
      products: str,
      calori: calori
    }
    axios
      .post('http://localhost:5000/receipt', userData)
      .then(response => {
        console.log('Succ', response.data)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  function handleAdd () {
    const currentProduct = sklad.find(
      element => element.productname === selectedOption
    )
    const regex = /\d+(?=:)/g
    if (result) {
      const matches = result.match(regex)
      const tmp = matches.find(element => {
        return parseInt(element) === currentProduct.productid
      })
      if (tmp) {
        const regex = new RegExp(`${tmp}:(\\d+)`, 'g')
        const newNumber = quintity
        let str = result
        str = str.replace(regex, `${tmp}:${newNumber}`)
        setResult(str)
      } else {
        let str = result + currentProduct.productid + ':' + quintity + ', '
        setResult(str)
      }
    } else {
      let str = result + currentProduct.productid + ':' + quintity + ', '
      setResult(str)
    }
  }
  return (
    <main>
      <div className={styles.container}>
        <div className={styles.row}>
          <label htmlFor='receipt'>Receipt:</label>
          <input
            value={receipt}
            onChange={handleReceipt}
            type='text'
            id='receipt'
            name='receipt'
          />
        </div>
        <div className={styles.row}>
          <label htmlFor='products'>Products:</label>
          <select
            id='products'
            onChange={handleSelectChange}
            value={selectedOption}
          >
            {sklad &&
              sklad.map((option, index) => (
                <option key={index} value={option.productname}>
                  {option.productname}
                </option>
              ))}
          </select>
        </div>
        <div className={styles.row}>
          <label htmlFor='quantity'>Quantity:</label>
          <input
            min='1'
            value={quintity}
            onChange={handleQuntity}
            type='number'
            id='quantity'
            name='quantity'
          />
        </div>
        <div className={styles.row}>
          <label htmlFor='calories'>Сalories:</label>
          <input
            onChange={handleCalori}
            value={calori}
            min='1'
            type='number'
            id='calories'
            name='calories'
          />
          <button className={styles.addButton}type='button' onClick={handleAdd}>
            Add
          </button>
        </div>
        <div className={styles.row}>
          <button onClick={handleSubmit} type='submit'>
            Submit
          </button>
        </div>
        <div className={styles.row}>
          <textarea value={info} readOnly rows='4' cols='50'></textarea>
        </div>
      </div>
    </main>
  )
}
