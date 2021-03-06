

const createBackgroundService = ({func, type = "sync", delay = 1000}, context) => {
    let interval = null;
    let results = [];
    let isRun = false;
    return {
        run: () => {
            if(!isRun){
                interval = setInterval(async () => {
                    let result = null;
                    if(type === "async"){
                        result = await func(context);
                    }else{
                        result = func(context);
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