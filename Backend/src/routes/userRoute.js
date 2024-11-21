const express = require("express");
const router = express.Router();
const checkLoggedIn = require("../middleware/auth");
const checkAdminRole = require("../middleware/admin");
const {loginUser} = require("../controllers/loginController")
const {addUser} = require("../controllers/userController");
const {getUser, updateUser, deleteUser} = require("../services/userServices")

router.post("/login", (req, res)=>loginUser(req, res));
router.post('/register', (req, res)=>addUser(req, res));
router.post("/users/add", checkLoggedIn, checkAdminRole, (req, res)=>addUser(req, res));
router.get("/users/:id?", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;