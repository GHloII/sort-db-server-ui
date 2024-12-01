const {radixSort} = require('./sort.js'); // Импортируем вашу функцию
const {getDigit} = require('./sort.js');


describe('Radix Sort Tests', () => {
    test('Сортировка массива положительных чисел', () => {
        const array = [170, 45, 75, 90, 802, 24, 2, 66];
        const sorted = radixSort(array, 3); // 3 - максимальное количество разрядов
        expect(sorted).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
    });

    test('Сортировка массива с повторяющимися элементами', () => {
        const array = [3, 3, 1, 2, 2];
        const sorted = radixSort(array, 1);
        expect(sorted).toEqual([1, 2, 2, 3, 3]);
    });

    test('Сортировка уже отсортированного массива', () => {
        const array = [1, 2, 3, 4, 5];
        const sorted = radixSort(array, 1);
        expect(sorted).toEqual([1, 2, 3, 4, 5]);
    });

    test('Сортировка массива с одним элементом', () => {
        const array = [42];
        const sorted = radixSort(array, 2);
        expect(sorted).toEqual([42]);
    });

    test('Сортировка пустого массива', () => {
        const array = [];
        const sorted = radixSort(array, 1);
        expect(sorted).toEqual([]);
    });

    test('Сортировка массива с нулями', () => {
        const array = [0, 0, 0, 0];
        const sorted = radixSort(array, 1);
        expect(sorted).toEqual([0, 0, 0, 0]);
    });

});