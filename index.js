const colors = require('colors');

// получаем диапазон значений из консоли, при запуске файла (node ./index.js 0-99)
let range = process.argv[2].split('-');
let simpleNums = [];
if(range.length === 2) {
    if (range[0] > range[1]){
        let l = range[0]; range[0] = range[1]; range[1] = l;
    }
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
    for (let i = 0, counter = 0; i < simpleNums.length; i++, counter++) {
        if (simpleNums[i] === 0 || simpleNums[i] === 1) continue;
        switch (counter) {
            case 1:
                console.log(`${simpleNums[i]}`.red);
                break;
            case 2:
                console.log(`${simpleNums[i]}`.green);
                break;
            case 3:
                console.log(`${simpleNums[i]}`.yellow);
                counter = 0;
        }
    }
}else{
    console.log('Error. Input 2 numbers: x-y')
}