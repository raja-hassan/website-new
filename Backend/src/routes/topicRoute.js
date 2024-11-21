const express = require("express");
const router = express.Router();
const checkLoggedIn = require("../middleware/auth");
const checkAdminRole = require("../middleware/admin");
const {addTopic} = require("../controllers/topicController");
const {getTopic, updateTopic, deleteTopic} = require("../services/topicServices")

router.post("/topics/add", checkLoggedIn, checkAdminRole, (req, res)=>addTopic(req, res));
router.get("/topics/:id?", (req, res) => getTopic(req, res));
router.put("/topics/:id", updateTopic);
router.delete("/topics/:id", deleteTopic);

module.exports = router;