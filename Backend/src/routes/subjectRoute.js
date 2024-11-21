const express = require("express");
const router = express.Router();
const {addSubject} = require("../controllers/subjectController");
const {getSubject, updateSubject, deleteSubject} = require("../services/subjectServices")

router.post("/subjects/add", (req, res)=>addSubject(req, res));
router.get("/subjects/:id?", (req, res) => getSubject(req, res));
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

module.exports = router;