import moment from "moment"

const isActive = (event) => {
    let childEvents = event.childEvents;

    let currentDate = new Date().getTime();
    console.log("current " + moment(currentDate).format("DD/MM/YYYY HH:mm"))
    for(let ev of childEvents){
        let fromDate = new Date(ev.from).getTime();
        console.log("from " + moment(fromDate).format("DD/MM/YYYY HH:mm"))
        let toDate = new Date(ev.to).getTime();
        console.log("to " + moment(toDate).format("DD/MM/YYYY HH:mm"))
        if(!!(event.active && toDate - currentDate > 0 && currentDate - fromDate > 0))
            return true;
    }

    return false;
};

module.exports = {
    isActive
};