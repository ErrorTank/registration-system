import {appConfigCache} from "../../client/common/cache/api-cache/common-cache";

const omit = require("lodash/omit");
const moment = require("moment");
moment.locale("vi");


const isActive = (event, currentDate, {currentSemester, currentYear}) => {
    let childEvents = event.childEvents;
    if (event.semester !== currentSemester || event.year.from !== currentYear.from || event.year.to !== currentYear.to) {
        return false;
    }

    // console.log("current " + moment(currentDate).format("DD/MM/YYYY HH:mm"))
    for (let ev of childEvents) {
        let fromDate = new Date(ev.from).getTime();
        // console.log("from " + moment(fromDate).format("DD/MM/YYYY HH:mm"))
        let toDate = new Date(ev.to).getTime();
        // console.log("to " + moment(toDate).format("DD/MM/YYYY HH:mm"))
        if (!!(event.active && toDate - currentDate > 0 && currentDate - fromDate > 0))
            return true;
    }

    return false;
};

const getEventStatus = (event, currentDate, {currentYear, currentSemester}, {year, semester}) => {
    if (year.from !== currentYear.from || semester !== currentSemester) {
        return {
            message: "Thuộc kì khác",
            value: 1
        };
    }

    let fromDate = new Date(event.from).getTime();
    // console.log("from " + moment(fromDate).format("DD/MM/YYYY HH:mm"))
    let toDate = new Date(event.to).getTime();
    // console.log("to " + moment(toDate).format("DD/MM/YYYY HH:mm"))

    if (!!(toDate - currentDate > 0 && currentDate - fromDate > 0))
        return {
            message: "Đang diễn ra",
            value: 0
        };
    if (!!(toDate - currentDate <= 0)) {
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

const startRegistrationEventCountdown = () => {

}
const getStudentGroup = (schoolYear, department, latestSchoolYear) => {
    if (schoolYear === latestSchoolYear) {
        return 3;
    }
    if (schoolYear < latestSchoolYear - 1 && department === "KT_QL") {
        return 1;
    }
    return 2;
};

const transformSubjectLesson = subject => {
    let {lessons} = subject;
    let tracker = {};
    let testArr = lessons.map(each => {
        return {
            ...each,
            length: (/.*?\.(.+)_(\w+)/gi.exec(each.name) || /.*?\.(.+)/gi.exec(each.name))[1].split(".").length
        }
    }).sort((a, b) => b.length - a.length).map(each => omit(each, "length"));
    for (let l of testArr) {
        let result = /.*?\.(.+)_(\w+)/gi.exec(l.name) || /.*?\.(.+)/gi.exec(l.name);
        let cl = result[1];
        console.log(l.name)
        console.log(Object.keys(tracker))
        if (tracker.hasOwnProperty(cl)) {
            tracker[cl] = tracker[cl].concat(l);
        } else {
            let isInclude = false;
            for (let key of Object.keys(tracker)) {
                if (key.startsWith(cl)) {
                    isInclude = true;
                    tracker[key] = tracker[key].concat(l);
                }
            }
            if (!isInclude) {
                tracker[cl] = [l]
            }

        }


    }

    return {...subject, lessons: [...Object.values(tracker)]}
};

module.exports = {
    isActive,
    getEventStatus,
    startRegistrationEventCountdown,
    getStudentGroup,
    transformSubjectLesson
};