const express = require("express");

const router = express.Router();

const {
  submitContact,

  getLeads,
} = require("../controllers/contact.controller");

router.post("/submit", submitContact);

router.get("/", getLeads);

module.exports = router;
