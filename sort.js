// модуль readline для чтения из консоли
const readline = require('readline');



//возвращает массив
async function InputNumArray() {
    rl.on('SIGTSTP', () => {
        // This will override SIGTSTP and prevent the program from going to the
        // background.
        console.log('Caught SIGTSTP.'); //event is emitted when the input stream receives a Ctrl+Z input
        return NaN;
    });

    let array;
    let is_error = true;
    while (true) {
        const input = await new Promise((resolve) => {
            rl.question("", (answer) => {
                resolve(answer);
            });
        });

        // Разделяем введённую строку на числа
        const numbers = input.split(' ').map(number => {
            number = Number(number);
            if (isNaN(number)) {
                console.log(`Ошибка: "${input}" не является числом. Попробуйте снова.`);
                return NaN; // Возвращаем NaN для обработки ошибки
            }
            return number;
        });

        // Проверяем наличие NaN в массиве
        if (numbers.includes(NaN)) {
            // Если есть ошибка, продолжаем цикл
            continue;
        }

        // Если все числа валидные, сохраняем результат
        array = numbers;
        rl.close(); // Закрываем интерфейс
        break; // Выходим из цикла
    }
 
    return array;
}









// Создаём интерфейс для чтения данных из стандартного потока ввода
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Введите числа через пробел:");
(async () => {
    const array = await InputNumArray();
    console.log("Введённые числа:", array);
})();













