const colors = require('colors');

// получаем диапазон значений из консоли, при запуске файла (node ./index.js 0-99)
let range = process.argv[2].split('-');
let simpleNums = [];

// поочередно обходим все числа и проверяем, делится ли каждое из них на числа
// от "2" до самого числа (не включительно), если да - флаг,
// те что сохранили true добавляем в массив простых чисел
for (let i = Number(range[0]); i <= Number(range[1]); i++) {
    let flag = true;

    for (let j = 2; j < i; j++) {
        if (i % j === 0) {
            flag = false;
            break;
        }
    }

    (flag) ? simpleNums.push(i) : '';
}

// обходим полученный массив простых чисел, при каждой итерации меняя счетчик на 1
for (let i = 0, counter = 1; i < simpleNums.length; i++, counter++) {
    switch (counter){
        case 1:
            console.log(`${simpleNums[i]}`.green);
            break;
        case 2:
            console.log(`${simpleNums[i]}`.yellow);
            break;
        case 3:
            console.log(`${simpleNums[i]}`.red);
            counter = 0;
    }
}