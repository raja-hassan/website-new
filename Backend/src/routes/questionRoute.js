const express = require("express");
const router = express.Router();
const checkLoggedIn = require("../middleware/auth");
const checkAdminRole = require("../middleware/admin");
const {addQuestion} = require("../controllers/questionController");
const {getQuestion, updateQuestion, deleteQuestion} = require("../services/questionServices")

router.post("/questions/add", checkLoggedIn, checkAdminRole, (req, res)=>addQuestion(req, res));
router.get("/questions/:id?", (req, res) => getQuestion(req, res));
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

module.exports = router;