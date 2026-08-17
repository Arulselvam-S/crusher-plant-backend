const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// GET ALL CONTACTS
router.get("/", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});
router.put("/:id", async (req, res) => {
  const contact =
    await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

  res.json(contact);
});

router.delete("/:id", async (req, res) => {
  await Contact.findByIdAndDelete(
    req.params.id
  );

  res.json({
    success: true,
  });
});
// ADD CONTACT
router.post("/", async (req, res) => {
  const contact = new Contact(req.body);

  const savedContact =
    await contact.save();

  res.status(201).json(savedContact);
});

module.exports = router;