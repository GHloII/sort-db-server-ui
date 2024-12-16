

function getDigit(number, position){
    for (let i = 0; i < position; i++) {
        number = Math.floor(number/10);
    }
    return number % 10;
}


function radixSort(array,amountOF){
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


function sort_(array){
    let max = Math.max(...array);
    let amountOF = 0;

    while (max>0) {
        max = Math.floor(max / 10);
        amountOF++;
    }

    return radixSort(array, amountOF)
}
module.exports = { sort_,radixSort,getDigit };