const {getActiveRegistrationEvent} = require("../../../db/db-controllers/registration-event");
const isEqual = require("lodash/isEqual");
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
            func: (...args) => {
                getActiveRegistrationEvent().then(data => {
                    // console.log(data);
                    let activeEvents = data.map(each => ({parentID: each._id, event: each.activeChildEvent, difference: each.difference}));
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
                            let newItem = {
                                event: {...e.event},
                                terminator: createCustomTimeout(() => {
                                    console.log("hehehe")
                                    console.log(e);
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