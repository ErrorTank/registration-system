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
module.exports = {
    transformResults
};