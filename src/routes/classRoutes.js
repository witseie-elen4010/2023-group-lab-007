const path = require('path')
const express = require('express')
const logger = require("../../logger");
const router = express.Router()
const lecturerConsultations = require('../lecturerConsultation.js').get();
const studentConsultations = require('../studentConsultation.js').getS();

router.get('/api/studentConsultations', function (req, res) {
  res.json(studentConsultations) // Respond with JSON
})

router.get('/api/lecturerConsultations', function (req, res) {
  res.json(lecturerConsultations) // Respond with JSON
})

module.exports = router
