const express = require("express");
const projectController = require("../controlers/projectController");
const authControler = require("../controlers/authController");

const { getAllProjects, getProject, createProject, updateProject, deleteProject, upadateProjectsMembers } = projectController;

const { protect, restrictTo } = authControler;

const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router
    .route("/:id")
    .get(getProject)
    .patch(updateProject)
    .delete(protect, restrictTo("admin", "user"), deleteProject);
router
    .route("/members/:id")
    .patch(upadateProjectsMembers);

module.exports = router;