const Project = require("../models/projectModel");

exports.getAllProjects = async (req, res) => {
  // const projects = await Project.find( );
  try {
    let projects;
    if(req.user.role === "admin"){
      projects = await Project.find();
    } else {
      const userId = req.user._id;
      projects = await Project.find({ user: userId });
    }
    res.status(200).json({
      status: "success",
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("tasks");
    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// get projects by task
exports.getProjectsByTask = async (req, res) => {
  try {
    // const { taskId } = req.params;
    // const projects = await Project.find({ tasks: taskId }).populate("tasks");
    // const filteredProjects = projects.filter(project => project.tasks.includes(taskId));
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate("tasks");
    const projectTasks = project.tasks;

    res.status(200).json({
      status: "success",
      data: {
        tasks: projectTasks,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({...req.body, user: req.user._id});
    res.status(201).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.upadateProjectsMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const membersData = req.body;

    console.log("******");
    console.log(membersData);

    
    const project = await Project.findByIdAndUpdate(
      id,
      { $push: { members: membersData } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
