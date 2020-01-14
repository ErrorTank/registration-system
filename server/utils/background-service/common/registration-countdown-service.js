const {getActiveRegistrationEvent} = require("../../../db/db-controllers/registration-event");
const isEqual = require("lodash/isEqual");
const pick = require("lodash/pick");
const createCustomTimeout = require("../../custom-timeout");

const createRegistrationCountdownService = () => {
    let existed = [];
    return {
        terminate: (eventID) => {
            for(let i = 0; i < existed.length; i++){

                if(existed[i].event._id.toString() === eventID.toString()){
                    existed[i].terminator.clear();
                    break;
                }
            }

        },
        getExistedEventsByIds: ids => existed.filter(each => ids.includes(each.event._id.toString())),
        getConfig: () => ({
            delay: 5000,
            name: "track-registration-event",
            func: ({namespacesIO}) => {
                getActiveRegistrationEvent().then(data => {
                    // console.log(data);
                    let activeEvents = data.map(each => ({parentID: each._id, year: each.year, semester: each.semester, studentGroup: each.studentGroup, event: each.activeChildEvent, difference: each.difference}));
                    existed = existed.filter(each => {
                        return each.terminator.isClear() === false;
                    });
                    for (let e of activeEvents) {
                        let eventInExisted = existed.find(each => each.event._id.toString() === e.event._id.toString());
                        // console.log(new Date().getTime())
                        // console.log("Event ID: ", e.event._id)
                        // console.log("Existed arr length: ", existed.length)
                        // console.log("Event existed ID: ", eventInExisted ? eventInExisted.event._id : null)

                        if (!eventInExisted) {
                            console.log(e)
                            namespacesIO.registrationTracker.emit("start-event", e);
                            let newItem = {

                                event: {...e.event},
                                terminator: createCustomTimeout(() => {
                                    console.log("hehehe")

                                    let returnEvent = {...e};
                                    console.log(returnEvent)
                                    namespacesIO.registrationTracker.to(returnEvent.parentID).emit("stop-event", returnEvent);
                                    newItem.terminator.clear();
                                }, e.difference)
                            };
                            existed.push(newItem)
                        }

                    }


                })
            },
            type: "async"
        }),

    }
};

const registrationCountdownService = createRegistrationCountdownService();


module.exports = registrationCountdownService;