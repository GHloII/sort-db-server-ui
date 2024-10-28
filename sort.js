// модуль readline для чтения из консоли
const readline = require('readline-sync');

//возвращает массив
function InputNumArray() {
    let array;
    while (true) {

        const input = readline.question('');

        let numbers = input.split(' ').map(number => {
            number = Number(number);
            if (isNaN(number)) {
                console.log(`Ошибка: "${input}" не является числом. Попробуйте снова.`);
                return NaN;                                 
            }
            return number;
        });
        if (numbers.includes(NaN)) {
            continue;
        }
        // Проверяем наличие NaN в массиве
        if (numbers.includes(NaN)) {
            continue;
        }

        // Если все числа валидные, сохраняем результат
        array = numbers;
        break;
    }
    return array;
}




async function main() {
    // show greets;





}



console.log("Введите числа через пробел:");
const array = InputNumArray();
console.log("Введённые числа:", array);;

console.log("чувырла");











