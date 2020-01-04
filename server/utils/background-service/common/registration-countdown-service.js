const {getActiveRegistrationEvent} = require("../../../db/db-controllers/registration-event");
const isEqual = require("lodash/isEqual");
const createCustomTimeout = require("../../custom-timeout");

const createRegistrationCountdownService = () => {
    let existed = [];
    return {
        getConfig: () => ({
            name: "track-registration-event",
            func: (...args) => {
                getActiveRegistrationEvent().then(data => {
                    // console.log(data);
                    let activeEvents = data.map(each => ({event: each.activeChildEvent, difference: each.difference}));
                    for (let e of activeEvents) {
                        let eventInExisted = existed.find(each => each.event._id === e.event._id);
                        if (!eventInExisted) {
                            existed.push({
                                event: {...e.event},
                                terminate: createCustomTimeout(() => {
                                    console.log("hehehe")
                                    console.log(e);
                                    existed = existed.filter(item => item.event._id === e.event._id);
                                }, e.difference)
                            })
                        }else if (!isEqual(eventInExisted.event, e.event)){
                            eventInExisted.event.terminate();
                            existed = existed.filter(item => item.event._id === e.event._id);
                            existed.push({
                                event: {...e.event},
                                terminate: createCustomTimeout(() => {
                                    console.log("hehehe")
                                    console.log(e);
                                    existed = existed.filter(item => item.event._id === e.event._id);
                                }, e.difference)
                            })
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