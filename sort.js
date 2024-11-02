// модуль readline для чтения из консоли
const readline = require('readline-sync');
const fs = require('fs');


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
    if (invalidNames.includes(filename.toUpperCase())) {
        return false;
    }

    return true; // Если все проверки пройдены
}

//возвращает массив
function InputNumArrayFromStDIN() {
    let array;
    while (true) {
        const input = readline.question('');

        let numbers = input.split(' ').map(number => {
            number = Number(number);
            if (isNaN(number)) {
                console.log(`Ошибка: содержимое "${input}" не является числом. Попробуйте снова.`);
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
            if (isNaN(number)) {
                console.log(`Ошибка: содержимое "${input}" не является числом. Попробуйте снова.`);
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
    } catch (err) {
        console.error('Ошибка записи массива в файл:');
        return null;
    }
}

function InputNumArrayFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const array = JSON.parse(data);

        let numbers = array.map(number => {
            number = Number(number);
            if (isNaN(number)) {
                console.log(`Ошибка: содержимое "${input}" не является числом. Попробуйте снова.`);
                return NaN;
            }
            
            console.log('Массив успешно загружен из файла.');
            return number;
        });

        if (numbers.includes(NaN)) {
            return null;
        }

    } catch (err) {
        console.error('Ошибка чтения массива из файла:');
        return null;
    }
}

function fileWork(callback, array) {
    let filename;
    while (true) {
        console.log("Напишите путь до файла");
        filename = readline.question('');

        if (isValidFilename(filename)) {
            const result = callback(filename, array);
            if (result === null) continue;
            break;
        }
        else {
            console.log("Путь не валидный. Попробуйте снова");
        }
    }
    return result;
}




function getDigit(number, position){
    for (let i = 0; i <= position; i++) {
        number = Math.floor(number/10);        
    }
    return number % 10;
}


function RadixSort(array,amountOF){
    let buffer;

    for(let j =0; j< amountOF;++j){

        buffer = Array.from({ length: 10 }, () => []);

        for (let num of array) {
            let digit = getDigit(num, j);
            buffer[digit].push(num);
        }

        array  = [];

        for (let innerVec of buffer) {
            for (let num of innerVec) {
                array.push(num);
            }
        }
    }

    return array;
}






function menu() { // должно уметь разное заполнение разный выход данных в разных форматах и выход естесна
    //выбрать заполнение один раз
    let array;

    console.log("Выберите способ заполнения:");
    outerLoop:
    while (true) {
        let command;
        console.log("1 - заполнение  из файла\n2 - ввод из консоли\n3 - заполнение рандомными числами  ");
        command = InputNumFromSTDIN();
        switch (command) {
            case 1:
                console.log("файл");
                array = fileWork(InputNumArrayFromFile);
                break outerLoop;
            case 2:
                console.log("консоль");
                array = InputNumArrayFromStDIN();
                break outerLoop;
            case 3:
                console.log("рандом");
                array = InputRandomNumArray()
                break outerLoop;
            default:
                console.log("команда не найдена");
                break;
        }
    }
    
    //сортировка
    console.log(array);
    
    let max = Math.max(...array);
    let amountOF = 0;
    console.log(max);

    while (max>0) {
        max = Math.floor(max / 10);
        amountOF++;
    }
    console.log(amountOF);

    array = RadixSort(array,amountOF);
    
    
    // сохранение
    console.log(array);

    console.log("Выберите способ сохранения:");
    outerLoop:
    while (true) {
        let command;
        console.log("1 - сохранение в файл\n ");
        command = InputNumFromSTDIN();
        switch (command) {
            case 1:
                console.log("файл");
                fileWork(saveArrayToFile, array);
                break outerLoop;
            case 2:
                console.log("консоль");
                array = InputNumArrayFromStDIN();
                break outerLoop;
            case 3:
                console.log("выход из меню");
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
        console.log("1 - запустить программу\n2 - запустить тесты\n3 - выйти из программы  ");
        command = InputNumFromSTDIN();

        switch (command) {
            case 1:
                console.log("запуск выполнен");
                menu();
                break;
            case 2:
                console.log("тесты выполнены");
                break;
            case 3:
                console.log("выход выполнен");
                return;
            default:
                console.log("команда не найдена");
                break;
        }
    }
}

main();


 









/*
TO DO

- sort
- menu

*/








