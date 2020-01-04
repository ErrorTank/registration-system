

const createBackgroundService = ({func, type = "sync", delay = 1000}) => {
    let interval = null;
    let results = [];
    let isRun = false;
    return {
        run: (...args) => {
            if(!isRun){
                interval = setInterval(async () => {
                    let result = null;
                    if(type === "async"){
                        result = await func(...args);
                    }else{
                        result = func(...args);
                    }
                    results.push({
                        time: new Date().getTime(),
                        value: result
                    });
                }, delay);
            }
            isRun = true;
        },
        getResults: () => [...results],
        terminate: () => {
            if(interval){
                clearInterval(interval);
                results = [];
            }
        }
    }
};

module.exports = createBackgroundService;