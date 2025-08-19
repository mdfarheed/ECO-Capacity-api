const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer setup
const {
  addMember,
  updateMember,
  deleteMember,
  getAllMembers,
  getMemberById
} = require("../controllers/memberController");

// Create Member
router.post("/", upload.single("profileImg"), addMember);

// Update Member
router.put("/:id", upload.single("profileImg"), updateMember);

// Delete Member
router.delete("/:id", deleteMember);

// Get All Members
router.get("/", getAllMembers);

// Get Member by ID
router.get("/:id", getMemberById);

module.exports = router;
