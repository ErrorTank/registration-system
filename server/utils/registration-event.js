import moment from "moment"
moment.locale("vi");

const isActive = (event, currentDate) => {
    let childEvents = event.childEvents;


    // console.log("current " + moment(currentDate).format("DD/MM/YYYY HH:mm"))
    for(let ev of childEvents){
        let fromDate = new Date(ev.from).getTime();
        // console.log("from " + moment(fromDate).format("DD/MM/YYYY HH:mm"))
        let toDate = new Date(ev.to).getTime();
        // console.log("to " + moment(toDate).format("DD/MM/YYYY HH:mm"))
        if(!!(event.active && toDate - currentDate > 0 && currentDate - fromDate > 0))
            return true;
    }

    return false;
};

const getEventStatus = (event, currentDate) => {

    let fromDate = new Date(event.from).getTime();
    // console.log("from " + moment(fromDate).format("DD/MM/YYYY HH:mm"))
    let toDate = new Date(event.to).getTime();
    // console.log("to " + moment(toDate).format("DD/MM/YYYY HH:mm"))
    if(!!(toDate - currentDate > 0 && currentDate - fromDate > 0))
        return {
            message: "Đang diễn ra",
            value: 0
        };
    if(!!(toDate - currentDate <= 0)){
        return {
            message: moment(toDate).from(moment()),
            value: 1
        };
    }
    return {
        message: moment().to(moment(fromDate)),
        value: 2
    };

};

module.exports = {
    isActive,
    getEventStatus
};