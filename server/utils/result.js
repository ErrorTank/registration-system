const transformResults = ({result}) => {
    let {list, msv, speciality, name} = result;

    return new Promise(resolve => {
        resolve({
            result: {
                owner: {
                    identityID: msv,
                    name
                },
                speciality,
                results: list.map(sub => ({
                    subject: {
                        subjectID:  sub.subjectID
                    },
                    grade: sub.grade === "?" ? -2 : Number(sub.grade.toString().replace(",", "."))
                }))
            }
        });
    })
};

const calculateTotalCredits = (list) => {

    if(!list){
        return 0;
    }
    return list.reduce((total, cur) => total + ((cur.grade < 5 || ["PG121", "PG100"].includes(cur.subject.subjectID)) ? 0 : cur.subject.credits), 0);

};

module.exports = {
    transformResults,
    calculateTotalCredits
};