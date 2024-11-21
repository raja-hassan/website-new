const express = require("express");
const router = express.Router();
const checkLoggedIn = require("../middleware/auth");
const checkAdminRole = require("../middleware/admin");
const {addExam} = require("../controllers/examController");
const {getExam, startExam, submitExam} = require("../services/examServices");
// const {getQuestion, updateQuestion, deleteQuestion} = require("../services/questionServices")

router.get("/exam", checkLoggedIn, checkAdminRole, (req, res)=>getExam(req, res)); //example URL: /exam?user=66bfb7732db2ae3a35fb5617
router.get("/exam/generate", checkLoggedIn, checkAdminRole, (req, res)=>addExam(req, res)); //example URL: /exam/generate?user=66bfb7732db2ae3a35fb5617&subject=66bfbdfe2db2ae3a35fb561d&topics=66c12c546edaf52494b18a0d,66c12cb96edaf52494b18a10&level=1
router.get("/exam/start", checkLoggedIn, checkAdminRole, (req, res)=>startExam(req, res)); //example URL: /exam/generate?user=66bfb7732db2ae3a35fb5617&subject=66bfbdfe2db2ae3a35fb561d&topics=66c12c546edaf52494b18a0d,66c12cb96edaf52494b18a10&level=1
router.post("/exam/submit", checkLoggedIn, checkAdminRole, (req, res)=>submitExam(req, res));
// router.get("/questions/:id?", (req, res) => getQuestion(req, res));
// router.put("/questions/:id", updateQuestion);
// router.delete("/questions/:id", deleteQuestion);

module.exports = router;