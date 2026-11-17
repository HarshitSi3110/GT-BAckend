const Contact = require("../models/contact.model");

exports.submitContact = async (req, res) => {
  try {
    const data = await Contact.create(req.body);

    res.status(201).json({
      success: true,

      message: "Enquiry submitted",

      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const data = await Contact.find()

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      data,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};
