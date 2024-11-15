const {isValidFilename} = require('./sort.js');

beforeAll(() => {
    // Замокаем console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterAll(() => {
    // Восстанавливаем console.log после тестов
    console.log.mockRestore();
  });


describe('isValidFilename', () => {
    test('валидные имена', () => {
        expect(isValidFilename('file.json')).toBe(true);
        expect(isValidFilename('my_file.json')).toBe(true);
        expect(isValidFilename('another.file.json')).toBe(true);
        expect(isValidFilename('file123.json')).toBe(true);
    });

    test('недопустимые символы', () => {
        expect(isValidFilename('file<.json')).toBe(false);
        expect(isValidFilename('file>.json')).toBe(false);
        expect(isValidFilename('file:.json')).toBe(false);
        expect(isValidFilename('file/.json')).toBe(false);
        expect(isValidFilename('file\\.json')).toBe(false);
        expect(isValidFilename('file|.json')).toBe(false);
        expect(isValidFilename('file?.json')).toBe(false);
        expect(isValidFilename('file*.json')).toBe(false);
    });

    test('имя начинается с пробела или точки', () => {
        expect(isValidFilename(' .json')).toBe(false);
        expect(isValidFilename('.file.json')).toBe(false);
    });

    test('недопустимые имена в Windows', () => {
        expect(isValidFilename('CON')).toBe(false);
        expect(isValidFilename('con.json')).toBe(false);
        expect(isValidFilename('PRN')).toBe(false);
        expect(isValidFilename('COM1')).toBe(false);
    });

    test('недопустимые расширения', () => {
        expect(isValidFilename('file.txt')).toBe(false);
        expect(isValidFilename('file')).toBe(false);
        expect(isValidFilename('file.json.txt')).toBe(false);
    });

    test('пустое имя', () => {
        expect(isValidFilename('')).toBe(false);
    });
});


const readline = require('readline-sync');

jest.mock('readline-sync'); // Мокаем модуль readline-sync

describe('InputNumFromSTDIN ', () => {
    let { InputNumFromSTDIN } = require('./sort.js');

    beforeEach(() => {
        jest.clearAllMocks();  // Очищаем моки перед каждым тестом
    });

    test('должен вернуть положительное число', () => {
        readline.question.mockReturnValueOnce('42');  // Мокаем ввод '42'
        
        const result = InputNumFromSTDIN();
        expect(result).toBe(42);  // Проверяем, что результат соответствует ожидаемому числу
    });

    test('должен продолжать запрашивать ввод до корректного числа', () => {
        readline.question
            .mockReturnValueOnce('abc')  // Первый ввод неправильный
            .mockReturnValueOnce('-1')   // Второй ввод неправильный (отрицательное число)
            .mockReturnValueOnce('20');  // Третий ввод правильный

        const result = InputNumFromSTDIN();
        expect(result).toBe(20);  // Ожидаем, что результат будет 20 после корректного ввода
    });
});







const { InputNumArrayFromStDIN } = require('./sort.js');
describe('InputNumArrayFromSTDIN', () => {

    beforeEach(() => {
        jest.clearAllMocks();  // Очищаем моки перед каждым тестом
    });

    test('должен вернуть массив с положительными числами', () => {
        readline.question.mockReturnValue('10 20 30');  // Мокаем ввод '10 20 30'
        
        const result = InputNumArrayFromStDIN();
        expect(result).toEqual([10, 20, 30]);  // Проверяем, что результат — массив с числами
    });

    test('должен вернуть массив с одним положительным числом', () => {
        readline.question.mockReturnValue('42');  // Мокаем ввод '42'
        
        const result = InputNumArrayFromStDIN();
        expect(result).toEqual([42]);  // Проверяем, что результат — массив с числом 42
    });

    test('должен продолжать запрашивать ввод до корректного массива', () => {
        readline.question
            .mockReturnValueOnce('abc')  // Первый ввод неправильный
            .mockReturnValueOnce('-1')   // Второй ввод неправильный (отрицательное число)
            .mockReturnValueOnce('10 abs 30')// Третий ввод правильный
            .mockReturnValueOnce('10 20 30');  

        const result = InputNumArrayFromStDIN();
        expect(result).toEqual([10, 20, 30]);  // Ожидаем, что результат будет массивом [10, 20, 30]
    });
});


