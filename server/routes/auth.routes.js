const express = require("express");
const router = express.Router();
const { signup , verifyEmail , logout, login , forgotPassword , resetPassword ,protectRoute, getAllUsers, updateUserRole, deleteUser } = require("../controllers/auth.controller");
const { verifyTokenAndUserCheck , verifyAndAdminCheck} = require("../middleware/verifyToken");

router.get("/check-auth", verifyTokenAndUserCheck ,protectRoute); 

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// Admin: Get all users
router.get("/users", verifyAndAdminCheck, getAllUsers);
// Admin: Update user role
router.patch("/users/:id/role", verifyAndAdminCheck, updateUserRole);
// Admin: Delete user
router.delete("/users/:id", verifyAndAdminCheck, deleteUser);

// router.get("/refresh", (req, res) => {
//   res.send("Refresh route");
// });

module.exports = router;