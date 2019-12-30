import moment from "moment"

const isActive = (event) => {
    let currentDate = new Date().getTime();
    console.log("current " + moment(currentDate).format("DD/MM/YYYY HH:mm"))

    let fromDate = new Date(event.from).getTime();
    console.log("from " + moment(fromDate).format("DD/MM/YYYY HH:mm"))
    let toDate = new Date(event.to).getTime();
    console.log("to " + moment(toDate).format("DD/MM/YYYY HH:mm"))
    return !!(event.active && toDate - currentDate > 0 && currentDate - fromDate > 0);
};

module.exports = {
    isActive
};