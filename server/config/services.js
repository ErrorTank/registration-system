const services = require("../utils/background-service/services");
const createBackgroundService = require("../utils/background-service/background-service");

const createBgServiceManager = () => {
    let allServices = [];
    return {
        init: (context) => {
            for(let serviceConfig of services){
                let service = createBackgroundService(serviceConfig, context);
                service.run();
                allServices.push({
                    name: serviceConfig.name,
                    service
                });
            }
        },
        getService: key => allServices.find(each => each.name === key),
        getAll: () => allServices
    }
};

const serviceManager = createBgServiceManager();

module.exports = serviceManager;