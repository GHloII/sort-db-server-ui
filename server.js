const express = require('express');
const path = require('path');
const app = express();
const { sort_ } = require('./sort.js');
const mysql = require('mysql2');

app.use(express.static("Front"));
app.use(express.json());
const PORT = 3000;






//********************************************DB******************************************************* */
// Подключение к базе данных
const pool = mysql.createPool({
  host: 'MySQL',
  user: 'array_user',
  password: 'password',
  database: 'sort-db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



const MAX_RETRIES = 50; // Максимальное количество попыток
const RETRY_DELAY = 1000; // Задержка между попытками (мс)


function connectAndQuery(retries = 0) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(`Ошибка подключения к базе данных (попытка ${retries + 1}):`, err);

      if (retries < MAX_RETRIES) {
        console.log(`Повторная попытка подключения через ${RETRY_DELAY / 1000} секунд...`);
        setTimeout(() => connectAndQuery(retries + 1), RETRY_DELAY);
      } else {
        console.error('Максимальное количество попыток подключения исчерпано.');
      }
      return;
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Arrays (
        id int NOT NULL AUTO_INCREMENT,
        array json NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB AUTO_INCREMENT=155518 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    connection.query(createTableQuery, (err) => {
      if (err) {
        console.error('Ошибка создания таблицы:', err);
        connection.release();
        return;
      }

      console.log('Таблица Arrays проверена или создана.');

      connection.query('SELECT * FROM Arrays', (err, results) => {
        connection.release();

        if (err) {
          console.error('Ошибка выполнения запроса:', err);
          return;
        }

        console.log('Результаты:', results);
      });
    });
  });
}
// Запуск функции
connectAndQuery();



app.get('/getArrays', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Database connection error' });
      return;
    }

    // Запрос для получения данных
    connection.query('SELECT id, array FROM Arrays', (err, results) => {
      connection.release();
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).json({ error: 'Error querying database' });
        return;
      }
      console.log(results);
      res.json(results);
    });
  });
});

function isValidNum(number) {
  if (isNaN(number)) {
      window.alert(`Ошибка: содержимое не является числом. Попробуйте снова.`);
      return false;
  }
  if (number < 0) {
      window.alert(`Ошибка: содержимое не является положительным числом или нулем. Попробуйте снова.`);
      return false;
  }
  if (number - Math.floor(number) !== 0) {
      window.alert(`Ошибка: содержимое не является целочисленным числом или нулем. Попробуйте снова.`);
      return false;
  }
  return true;
}

function isValidArray(arr) {
  for (let i = 0; i < arr.length; i++) {
      if (!isValidNum(arr[i])) {
          return false; // Если хотя бы один элемент не прошел проверку, возвращаем false
      }
  }
  return true; // Все элементы прошли проверку
}

// Обработчик POST запроса для сохранения данных
app.post('/saveToDB', (req, res) => {
  const arrayData = req.body;

  // Проверка, что данные валидны
  if (!Array.isArray(arrayData) || arrayData.length === 0|| !isValidArray(arrayData)) {
    return res.status(400).json({ error: 'Invalid array data' });
  }

  // Преобразуем массив в строку для хранения в базе данных
  const arrayString = JSON.stringify(arrayData);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Ошибка соединения с базой данных:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Запрос на сохранение данных в базу
    connection.query('INSERT INTO Arrays (array) VALUES (?)', [arrayString], (err, result) => {
      connection.release(); // Освобождаем соединение
      if (err) {
        console.error('Ошибка запроса к базе данных:', err);
        return res.status(500).json({ error: 'Error inserting data into DB' });
      }

      res.status(200).json({ success: 'Data saved successfully', id: result.insertId });
    });
  });
});

app.post('/deleteRow', (req, res) => {
  const arrayData = req.body.array;

  // Преобразуем массив в строку для поиска в базе данных
  let arrayString = JSON.stringify(arrayData);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Ошибка соединения с базой данных:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }
    console.log(arrayString);
    arrayString = arrayString.replace(/"/g, '');
    arrayString = arrayString.replace(/,/g, ', ');
    console.log(arrayString);

    // Запрос на удаление строки из базы данных с точным сравнением массива
    connection.query('DELETE FROM Arrays WHERE JSON_UNQUOTE(JSON_EXTRACT(array, "$")) = ? LIMIT 1', [arrayString], (err, result) => {
      connection.release(); // Освобождаем соединение
      if (err) {
        console.error('Ошибка запроса к базе данных:', err);
        return res.status(500).json({ error: 'Error deleting data from DB' });
      }

      if (result.affectedRows > 0) {
        res.status(200).json({ success: 'Row deleted successfully' });
      } else {
        res.status(404).json({ error: 'Row not found' });
      }
    });
  });
});





/******************************************************************************************************* */


app.get('/', (req, res) => {
  res.sendFile("Front/index.html", { root: __dirname });
});

// Start the server and listen on port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post("/", (req, res) => {
  console.log("Получен массив:", req.body); // Логируем входящие данные
  let array = req.body;
  array = sort_(array);
  console.log("Отправляем массив:", array); // Логируем выходные данные
  res.status(200).json(array); // Отправляем отсортированный массив
});

module.exports = { pool, };