
const isActive = (event) => {
    let currentDate = new Date().getTime();
    console.log(currentDate)
    let fromDate = new Date(event.from).getTime();
    console.log(fromDate)
    let toDate = new Date(event.to).getTime();
    console.log(toDate)
    return !!(event.isActive && toDate - currentDate > 0 && currentDate - fromDate > 0);
};

module.exports = {
    isActive
};