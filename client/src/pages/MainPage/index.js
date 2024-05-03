import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import axios from 'axios'

export default function MainPage () {
  const [data, setData] = useState(null)
  const [sklad, setSklad] = useState(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [count, setCount] = useState('')
  const [textarea, setTextarea] = useState('')
  const [exist, setExist] = useState(true)
  const [buttonPressed, setButtonPressed] = useState('')
  useEffect(() => {
    axios
      .get('http://localhost:5000/receipt')
      .then(({ data }) => {
        setData(data.rows)
        setSelectedOption(data.rows[0].receipt)
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

  const handleSelectChange = event => {
    setSelectedOption(event.target.value)
  }

  const handleChangeCount = event => {
    setCount(event.target.value)
  }

  useEffect(() => {
    if (data && sklad) {
      let grams = data.find(
        option => option.receipt === selectedOption
      ).idproductsandvalues

      let calorie =
        data.find(option => option.receipt === selectedOption).callori * count

      const parts = grams.split(',')
      let tmp = ''

      parts.forEach(element => {
        tmp +=
          sklad.find(
            sklElem =>
              parseInt(element.split(':')[0].trim()) === sklElem.productid
          ).productname +
          ' - ' +
          element.split(':')[1].trim() * count +
          'g\n'
      })
      tmp += '\n' + 'Calorii: ' + calorie
      setTextarea(tmp)
    }
  }, [count, selectedOption])

  function handleSubmitButton () {
    let productsExist = true
    setButtonPressed(true)

    let grams = data.find(
      option => option.receipt === selectedOption
    ).idproductsandvalues

    let stop = 0
    const parts = grams.split(',')
    parts.forEach(element => {
      let index = sklad.find(
        sklElem => parseInt(element.split(':')[0].trim()) === sklElem.productid
      )
      if (!index) {
        stop = 1
        return
      }
    })
    if (stop === 1) {
      setExist(0)
      return
    }
    parts.forEach(element => {
      let index =
        sklad.find(
          sklElem =>
            parseInt(element.split(':')[0].trim()) === sklElem.productid
        ).productid - 1
      let quantity = sklad[index].quantity

      if (
        parseInt(quantity) - count * parseInt(element.split(':')[1].trim()) >=
          0 &&
        productsExist
      ) {
        setExist(true)
        productsExist = true
      } else {
        productsExist = false
        setExist(false)
      }
    })

    if (productsExist) {
      parts.forEach(element => {
        let index =
          sklad.find(
            sklElem =>
              parseInt(element.split(':')[0].trim()) === sklElem.productid
          ).productid - 1
        let quantity = sklad[index].quantity

        let userData = {
          id: element.split(':')[0].trim(),
          quantity:
            parseInt(quantity) - count * parseInt(element.split(':')[1].trim())
        }
        sklad[index].quantity =
          parseInt(quantity) - count * parseInt(element.split(':')[1].trim())
        axios
          .post('http://localhost:5000/sklad/quantity', userData)
          .then(response => {
            console.log('Succ', response.data)
          })
          .catch(error => {
            console.error('Error:', error)
          })
      })
    }
  }

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.row}>
          <select id='eda' onChange={handleSelectChange} value={selectedOption}>
            {data &&
              data.map((option, index) => (
                <option key={index} value={option.receipt}>
                  {option.receipt}
                </option>
              ))}
          </select>
        </div>
        <div className={styles.row}>
          <input
            type='number'
            id='quantity'
            min='1'
            value={count}
            onChange={handleChangeCount}
            placeholder='Кількість страв у ШТ'
          />
        </div>

        <div className={styles.row}>
          <button onClick={handleSubmitButton}>Підтвердити вибір</button>
        </div>
        <div className={styles.row}>
          <textarea rows='4' cols='50' value={textarea} readOnly></textarea>
        </div>
        <div className={styles.row}>
          {exist ? (
            <label className={!buttonPressed ? styles.hidden : ''}>
              Успішно
            </label>
          ) : (
            <label className={!buttonPressed ? styles.hidden : ''}>
              нема продуктів
            </label>
          )}
        </div>
      </div>
    </main>
  )
}
