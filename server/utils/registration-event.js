
const isActive = (event) => {
    let currentDate = new Date().getTime();
    let fromDate = new Date(event.from).getTime();
    let toDate = new Date(event.from).getTime();
    return !!(event.isActive && toDate - currentDate > 0 && currentDate - fromDate > 0);
};

module.exports = {
    isActive
};