const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/account");
const Admin = require("../controllers/admin");

const router = express.Router();

router.get("/accounts", Admin.listUser);
router.put("/accounts/:id", Admin.updateUser);
router.delete("accounts/:id", Admin.deleteUser);


