const Member = require("../models/Member");
const { cloudinary } = require("../config/cloudinary");

// 🟢 Add Member
exports.addMember = async (req, res) => {
  try {
    const {
      firstName, lastName, title, categoryPrimary, categorySecondary,
      status, shortSummary, relevance, fullNarrativeBio, linkedIn, wikipedia
    } = req.body;

    const newMember = await Member.create({
      firstName,
      lastName,
      title,
      categoryPrimary,
      categorySecondary,
      status,
      shortSummary,
      relevance,
      fullNarrativeBio,
      profileImg: req.file
        ? {
            url: req.file.path,
            public_id: req.file.filename,
          }
        : null, // agar image nahi hai to null store hoga
      linkedIn,
      wikipedia,
    });

    res.status(201).json({ message: "Member created ✅", member: newMember });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 🟡 Update Member
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const {
      firstName, lastName, title, categoryPrimary, categorySecondary,
      status, shortSummary, relevance, fullNarrativeBio, linkedIn, wikipedia
    } = req.body;

    if (firstName) member.firstName = firstName;
    if (lastName) member.lastName = lastName;
    if (title) member.title = title;
    if (categoryPrimary) member.categoryPrimary = categoryPrimary;
    if (categorySecondary) member.categorySecondary = categorySecondary;
    if (status) member.status = status;
    if (shortSummary) member.shortSummary = shortSummary;
    if (relevance) member.relevance = relevance;
    if (fullNarrativeBio) member.fullNarrativeBio = fullNarrativeBio;
    if (linkedIn) member.linkedIn = linkedIn;
    if (wikipedia) member.wikipedia = wikipedia;

    if (req.file) {
      if (member.profileImg.public_id) {
        await cloudinary.uploader.destroy(member.profileImg.public_id);
      }
      member.profileImg = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    await member.save();
    res.status(200).json({ message: "Member updated ✅", member });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 🔴 Delete Member
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (member.profileImg.public_id) {
      await cloudinary.uploader.destroy(member.profileImg.public_id);
    }

    await Member.deleteOne({ _id: id });
    res.status(200).json({ message: "Member deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

// 🔍 Get All Members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: 1 });
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔍 Get Member by ID
exports.getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    res.status(200).json({ member });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Bulk Add / Update Members via JSON
 * Logic:
 * - if _id exists -> update
 * - if _id does not exist -> create
 * - ignore profileImg completely
 */
/**
 * Bulk Add / Update Members via JSON FILE
 */
exports.bulkUpsertMembers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "JSON file is required"
      });
    }

    // 🔹 Read JSON file buffer
    const fileData = JSON.parse(req.file.buffer.toString("utf-8"));

    const { members } = fileData;

    if (!Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format: members array missing"
      });
    }

    let created = 0;
    let updated = 0;

    for (const member of members) {
      // ❌ Ignore unwanted fields
      delete member.profileImg;
      delete member.createdAt;
      delete member.updatedAt;
      delete member.__v;

      if (member._id) {
        const updatedMember = await Member.findByIdAndUpdate(
          member._id,
          member,
          { new: true }
        );

        if (updatedMember) updated++;
      } else {
        await Member.create(member);
        created++;
      }
    }

    res.status(200).json({
      success: true,
      message: "Members JSON uploaded successfully ✅",
      summary: {
        total: members.length,
        created,
        updated
      }
    });

  } catch (error) {
    console.error("Bulk JSON upload error:", error);
    res.status(500).json({
      success: false,
      message: "Bulk JSON upload failed",
      error: error.message
    });
  }
};
