const omit = require("lodash/omit");
const uniq = require("lodash/uniq");
const uniqBy = require("lodash/uniqBy");

const transformSubject = subject => {
    let s = omit(subject, "STT");
    s.subjectsRequired = s.subjectsRequired || [];
    if(typeof s.subjectsRequired === "string"){
        s.subjectsRequired = uniq(s.subjectsRequired.match(/(\w{2}\d{3})/gi));
    }
    if(!s.creditsRequired){
        s.creditsRequired = 0;
    }
    return s;
};

const transformUploadYear = year => {
    let [from, to] = year.value.split("-");
    return {
        from: Number(from),
        to: Number(to)
    }
};

const transformSchoolScheduleItem = item => {
    let i = omit(item, ["credits", "name"]);
    let [sFrom, sTo] = item.shift.split("-");

    i.class = {
        name: i.class,
        subject: i.subjectID,
    };
    i.classRoom = {
        name: i.classRoom
    };
    i.from = Number(sFrom);
    i.to = Number(sTo);
    console.log(i.class)
    console.log(i.insInfo)
    i.instructor = {
        name: i.insInfo.replace(/\(\w+\)/gi, ""),
        identityID: /\((\w+)\)/gi.exec(i.insInfo)[1]
    };
    return i;

};

const transformData = ({schedule, eduProgram}) => {

    return new Promise((resolve) => {
        let {speciality, list} = eduProgram;
        let subjects = list.map(each => {
            return transformSubject(each);
        });
        let newEduProgram = {subjects, speciality};
        let {year, semester, studentGroup, list: scheduleList, } = schedule;
        let schoolScheduleItems = scheduleList
            .filter(each => subjects.find(s => s.subjectID === each.subjectID) && each.insInfo)
            .map(each => ({year: transformUploadYear(year),semester: semester.value, studentGroup: studentGroup.value ,...transformSchoolScheduleItem(each)}))
        ;
        let classes = schoolScheduleItems.map(each => each.class);
        let classRooms = uniqBy(schoolScheduleItems.map(each => each.classRoom), each => each.name);
        let instructors = uniqBy(schoolScheduleItems.map(each => each.instructor), each => each.identityID);
        resolve({subjects, eduProgram: newEduProgram, schoolScheduleItems, classes, classRooms, instructors});
    })
};

module.exports = {
    transformData
};