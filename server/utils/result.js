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
                    grade: sub.grade === "?" ? "?" : Number(sub.grade.toString().replace(",", "."))
                })).filter(sub => sub.grade !== "?")
            }
        });
    })
};
module.exports = {
    transformResults
};