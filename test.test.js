const { sort_ } = require('./sort.js');
// const mysql = require('mysql2');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'array_user',
  password: 'password',
  database: 'my_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
}

test('Добавление 100 массивов', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        for (let i = 0; i < 100; i++) {
            const randomArray = generateRandomArray(10); // 10 элементов
            await connection.query('INSERT INTO Arrays (array) VALUES (?)', [JSON.stringify(randomArray)]);
        }
        const endTime = Date.now();
        console.log(`Добавлено 100 массивов за ${(endTime - startTime) / 1000}s`);
        expect(true).toBe(true);
    } catch (error) {
        console.error('Ошибка добавления массивов:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});

test('Выгрузка и сортировка 100 случайных массивов', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        const [rows] = await connection.query('SELECT * FROM Arrays ORDER BY RAND() LIMIT 100');
        // Преобразуем строку в массив, если это невалидный JSON
        // Преобразуем строку в массив
        const arrays = rows.map(row => {
            try {
                //console.log('Строка перед парсингом:', row.array); // Log the raw string
                
                ar = row.array;

                // Map over parsed array to ensure all elements are numbers
                return ar
            } catch (error) {
                console.error('Ошибка парсинга строки:', row.array);
                throw new Error(`Некорректный JSON: ${row.array}`);
            }
        });

        const sortStart = Date.now();
        const sortedArrays = arrays.map(array => sort_(array));
        const sortEnd = Date.now();

        const endTime = Date.now();
        console.log(`Сортировка завершена за ${(sortEnd - sortStart) / 1000}s`);
        console.log(`Общее время работы: ${(endTime - startTime) / 1000}s`);
        console.log(`Среднее время работы с 1 массивом: ${(endTime - startTime) / arrays.length / 1000}s`);
        expect(sortedArrays.length).toBe(100);
    } catch (error) {
        console.error('Ошибка сортировки массивов:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});

test('Очистка базы данных', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        const [result] = await connection.query('DELETE FROM Arrays');
        const endTime = Date.now();

        console.log(`База данных очищена за ${(endTime - startTime) / 1000}s`);
        expect(result.affectedRows).toBeGreaterThan(0);
    } catch (error) {
        console.error('Ошибка очистки базы данных:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});



test('Добавление 1000 массивов', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        for (let i = 0; i < 1000; i++) {
            const randomArray = generateRandomArray(10); // 10 элементов
            await connection.query('INSERT INTO Arrays (array) VALUES (?)', [JSON.stringify(randomArray)]);
        }
        const endTime = Date.now();
        console.log(`Добавлено 1000 массивов за ${(endTime - startTime) / 1000}s`);
        expect(true).toBe(true);
    } catch (error) {
        console.error('Ошибка добавления массивов:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});

test('Выгрузка и сортировка 100 случайных массивов', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        const [rows] = await connection.query('SELECT * FROM Arrays ORDER BY RAND() LIMIT 100');
        const arrays = rows.map(row => {
            try {
                //console.log('Строка перед парсингом:', row.array); // Log the raw string
                
                ar = row.array;

                // Map over parsed array to ensure all elements are numbers
                return ar
            } catch (error) {
                console.error('Ошибка парсинга строки:', row.array);
                throw new Error(`Некорректный JSON: ${row.array}`);
            }
        });

        const sortStart = Date.now();
        const sortedArrays = arrays.map(array => sort_(array));
        const sortEnd = Date.now();

        const endTime = Date.now();
        console.log(`Сортировка завершена за ${(sortEnd - sortStart) / 1000}s`);
        console.log(`Общее время работы: ${(endTime - startTime) / 1000}s`);
        console.log(`Среднее время работы с 1 массивом: ${(endTime - startTime) / arrays.length / 1000}s`);
        expect(sortedArrays.length).toBe(100);
    } catch (error) {
        console.error('Ошибка сортировки массивов:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});

test('Очистка базы данных', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        const [result] = await connection.query('DELETE FROM Arrays');
        const endTime = Date.now();

        console.log(`База данных очищена за ${(endTime - startTime) / 1000}s`);
        expect(result.affectedRows).toBeGreaterThan(0);
    } catch (error) {
        console.error('Ошибка очистки базы данных:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});



test('Добавление 10000 массивов', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        for (let i = 0; i < 10000; i++) {
            const randomArray = generateRandomArray(10); // 10 элементов
            await connection.query('INSERT INTO Arrays (array) VALUES (?)', [JSON.stringify(randomArray)]);
        }
        const endTime = Date.now();
        console.log(`Добавлено 10000 массивов за ${(endTime - startTime) / 1000}s`);
        expect(true).toBe(true);
    } catch (error) {
        console.error('Ошибка добавления массивов:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});

test('Выгрузка и сортировка 100 случайных массивов', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        const [rows] = await connection.query('SELECT * FROM Arrays ORDER BY RAND() LIMIT 100');
        const arrays = rows.map(row => {
            try {
                //console.log('Строка перед парсингом:', row.array); // Log the raw string
                
                ar = row.array;

                // Map over parsed array to ensure all elements are numbers
                return ar
            } catch (error) {
                console.error('Ошибка парсинга строки:', row.array);
                throw new Error(`Некорректный JSON: ${row.array}`);
            }
        });

        const sortStart = Date.now();
        console.log(arrays);
        const sortedArrays = arrays.map(array => sort_(array));
        const sortEnd = Date.now();

        const endTime = Date.now();
        console.log(`Сортировка завершена за ${(sortEnd - sortStart) / 1000}s`);
        console.log(`Общее время работы: ${(endTime - startTime) / 1000}s`);
        console.log(`Среднее время работы с 1 массивом: ${(endTime - startTime) / arrays.length / 1000}s`);
        expect(sortedArrays.length).toBe(100);
    } catch (error) {
        console.error('Ошибка сортировки массивов:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});

test('Очистка базы данных', async () => {
    const connection = await pool.getConnection();
    const startTime = Date.now();

    try {
        const [result] = await connection.query('DELETE FROM Arrays');
        const endTime = Date.now();

        console.log(`База данных очищена за ${(endTime - startTime) / 1000}s`);
        expect(result.affectedRows).toBeGreaterThan(0);
    } catch (error) {
        console.error('Ошибка очистки базы данных:', error);
        expect(false).toBe(true);
    } finally {
        connection.release();
    }
});


