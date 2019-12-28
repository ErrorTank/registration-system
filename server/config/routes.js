const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.use('/api', require("../controllers/user")(db));
  router.use('/api', require("../controllers/speciality")(db));
  router.use('/api', require("../controllers/school-schedule-items")(db));
  router.use('/api', require("../controllers/result")(db));
  router.use('/api', require("../controllers/educate-program")(db));
  router.use('/api', require("../controllers/registration-event")(db));
  return router;
};