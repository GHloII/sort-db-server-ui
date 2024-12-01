// модуль readline для чтения из консоли
const readline = require('readline-sync');
const fs = require('fs');
const {sort} = require('./sort.js');

function isValidFilename(filename) {
    // Проверяем на недопустимые символы
    const invalidChars = /[<>:"\/\\|?*]/;
    if (invalidChars.test(filename)) {
        return false;
    }

    // Проверяем, не начинается ли имя файла с пробела или точки
    if (/^[. ]/.test(filename)) {
        return false;
    }

    // Проверка на недопустимые имена в Windows
    const invalidNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    const baseName = filename.split('.')[0].toUpperCase();  // Получаем имя без расширения и приводим к верхнему регистру
    if (invalidNames.includes(baseName)) {
        return false;
    }
    if (!filename.endsWith(".json")) {
        console.log("Это не JSON файл.");
        return false;
    }


    return true; // Если все проверки пройдены/
}

function isValidNum(number){
    if (isNaN(number)) {
        console.log(`Ошибка: содержимое "${number}" не является числом. Попробуйте снова.`);
        return false;
    }
    if (number < 0){
        console.log(`Ошибка: содержимое "${number}" не является положительным числом или нулем. Попробуйте снова.`);
        return false;
    }
    if (number - Math.floor(number)!== 0){
        console.log(`Ошибка: содержимое "${number}" не является целочисленным числом или нулем. Попробуйте снова.`);
        return false;
    }
    return true;
}

//возвращает массив
function InputNumArrayFromStDIN() {
    let array;
    while (true) {
        const input = readline.question('');

        let numbers = input.split(' ').map(number => {
            number = Number(number);
            if (!isValidNum(number)) {
                return NaN;
            }
            return number;
        });
        if (numbers.includes(NaN)) {
            continue;
        }
        // Если все числа валидные, сохраняем результат
        array = numbers;
        break;
    }
    return array;
}

//возвращает число
function InputNumFromSTDIN() {
    let num;
    while (true) {
        const input = readline.question('');

        let numbers = input.split(' ').map(number => {
            number = Number(number);
            if (!isValidNum(number)) {
                return NaN;
            }
            return number;
        });
        if (numbers.includes(NaN) || numbers.length > 1) {
            console.log(`Ошибка: введено несколько чисел. Попробуйте снова.`);
            continue;
        }

        num = numbers[0];
        break;
    }
    return num;
}

function InputRandomNumArray() {
    console.log("Напишите количество элементов в массиве");
    let capacity = InputNumFromSTDIN();
    const MAX = 10000;
    let array = new Array(capacity).fill(0).map(() =>
        Math.floor(Math.random() * MAX));
    return array;
}

function saveArrayToFile(filename, array) {
    try {
        const json = JSON.stringify(array);
        fs.writeFileSync(filename, json, 'utf8');
        console.log('Массив успешно записан в файл.');
        return 1;
    } catch (err) {
        console.error('Ошибка записи массива в файл:');
        return null;
    }
}

function InputNumArrayFromFile(filename) {
    let numbers;
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const array = JSON.parse(data);

        numbers = array.map(number => {
            number = Number(number);
            if (!isValidNum(number)) {
                return NaN;
            }
            return number;
        });

        if (numbers.includes(NaN)) {
            return null;
        }
        //console.log(filename);
    } catch (err) {
        console.error('Ошибка чтения массива из файла:');
        return null;
    }
    console.log('Массив успешно загружен из файла.');
    console.log('Загруженный массив:');
    console.log(numbers);
    return numbers;
}

function fileWork(callback, array) {
    let filename;
    let result;
    while (true) {
        console.log("Напишите путь до файла");
        filename = readline.question('');

        if (isValidFilename(filename)) {
            result = callback(filename, array);
            if (result === null) continue;
            break;
        }
        else {
            console.log("Путь не валидный. Попробуйте снова");
        }
    }
    return result;
}


function menu() { 
    let array;

    console.log("Выберите способ заполнения:");
    outerLoop:
    while (true) {
        let command;
        console.log("1 - заполнение  из файла\n2 - ввод из консоли\n3 - заполнение рандомными числами  ");
        command = InputNumFromSTDIN();
        switch (command) {
            case 1:
                console.log("");
                array = fileWork(InputNumArrayFromFile);
                break outerLoop;
            case 2:
                console.log("\nВведите неотрицательные числа через пробел");
                array = InputNumArrayFromStDIN();
                break outerLoop;
            case 3:
                console.log("\n");
                array = InputRandomNumArray()
                break outerLoop;
            default:
                console.log("команда не найдена");
                break;
        }
    }
    
    //сортировка
    array = sort(array);
    
    // сохранение
    console.log(array);

    console.log("Выберите способ сохранения:");
    outerLoop:
    while (true) {
        let command;
        console.log("1 - сохранение в файл\n2 - выход из меню ");
        command = InputNumFromSTDIN();
        switch (command) {
            case 1:
                fileWork(saveArrayToFile, array);
                break outerLoop;
            case 2:
                break outerLoop;
            default:
                console.log("команда не найдена");
                break;
        }
    }
    // выбрать сохранение до ехита
}



function main() {
    // show greets;
    let command;
    while (true) {
        console.log("1 - запустить программу\n2 - выйти из программы  ");
        command = InputNumFromSTDIN();

        switch (command) {
            case 1:
                console.log("запуск выполнен");
                menu();
                break;
            case 2:
                console.log("выход выполнен");
                return;
            default:
                console.log("команда не найдена");
                break;
        }
    }
}



if (process.env.NODE_ENV !== 'test') {
    // Код выполняется только если не в тестовой среде
    main();
  }
module.exports = { isValidFilename, InputNumFromSTDIN, InputNumArrayFromStDIN,InputRandomNumArray }
 









/*
TO DO

- sort
- menu

*/








