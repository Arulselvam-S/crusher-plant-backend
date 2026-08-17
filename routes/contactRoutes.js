const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// =====================================================
// GET ALL CONTACTS
// GET /api/contacts
// =====================================================
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json(contacts);
  } catch (error) {
    console.error("GET CONTACTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
});


// =====================================================
// GET SINGLE CONTACT
// GET /api/contacts/:id
// =====================================================
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("GET SINGLE CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
});


// =====================================================
// ADD CONTACT
// POST /api/contacts
// =====================================================
router.post("/", async (req, res) => {
  try {
    console.log("CONTACT REQUEST RECEIVED:");
    console.log(req.body);

    const {
      name,
      phone,
      email,
      message,
      status,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // -----------------------------
    // CREATE CONTACT
    // -----------------------------

    const contact = new Contact({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      message: message.trim(),
      status: status || "New",
    });

    // -----------------------------
    // SAVE TO MONGODB
    // -----------------------------

    const savedContact = await contact.save();

    console.log(
      "CONTACT SAVED SUCCESSFULLY:",
      savedContact._id
    );

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      contact: savedContact,
    });

  } catch (error) {
    console.error("POST CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send inquiry",
      error: error.message,
    });
  }
});


// =====================================================
// UPDATE CONTACT
// PUT /api/contacts/:id
// =====================================================
router.put("/:id", async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      contact,
    });

  } catch (error) {
    console.error("UPDATE CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update contact",
      error: error.message,
    });
  }
});


// =====================================================
// DELETE CONTACT
// DELETE /api/contacts/:id
// =====================================================
router.delete("/:id", async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });

  } catch (error) {
    console.error("DELETE CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
});


module.exports = router;