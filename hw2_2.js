const EventEmitter = require('events');

class TimerEmitter extends EventEmitter {
    constructor() {
        super();
    }
}
class TimerHandler {
    static tick(name, payload) {
        let numb = setInterval(() => {
            TimerHandler.log(name, payload);
            payload--;

            if (payload < 0){
                TimerHandler.stop(name, numb);
            }
        },1000);
    }

    static stop(name, intervalNumb) {
        clearInterval(intervalNumb);
        console.log(`${(name)} - Time is OUT!`);
    }

    static rangeToUnix(range) {
        let unixTime = 0;
        if (range[0]) {
            unixTime += range[0]*3600;
        }
        if(range[1]) {
            unixTime += range[1]*86400 ;
        }
        if(range[2]) {
            unixTime += range[2]*2629743;
        }
        if(range[3]) {
            unixTime += range[3]*31556926;
        }
        return unixTime;
    }

    static log(name, payload) {
        console.log(`${(name)} Time till the end: ${(payload)}`);
    }
}
class Timer {
    constructor(params) {
        this.name = params.name;
        this.payload = params.payload;
    }
}


const timerEmitter = new TimerEmitter();
timerEmitter.on('tick', TimerHandler.tick);

// получаем диапазон значений из консоли, при запуске файла (node ./hw2_2.js 1-0-0-0)
const moreThanOneTimer = (process.argv[2].split(' ').length > 1);
let range = (moreThanOneTimer)
    ? process.argv[2].split(' ')
    : process.argv[2].split('-');

const run = async () => {
    let timerNu = 1;
    if (moreThanOneTimer){
        for (const el of range) {
            const timer = await new Timer(
                {
                    name: `nu-${timerNu++}`,
                    payload: TimerHandler.rangeToUnix(el.split('-'))
                });
            timerEmitter.emit('tick', timer.name, timer.payload);
        }
    }else{
        const timer = await new Timer({name: `nu-${timerNu++}`, payload: TimerHandler.rangeToUnix(range)});
        timerEmitter.emit('tick', timer.name, timer.payload);
    }
}

run();