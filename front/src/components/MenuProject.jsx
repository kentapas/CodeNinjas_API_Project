import "../styles/MenuProject.css";
import IconList from "../components/IconList";
import {
  DashSquare,
  Trash,
  PencilSquare,
  ThreeDots,
} from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { postData } from "../services/post";
import { updateData } from "../services/update";
import { deleteData } from "../services/delete";
import { StateContext } from "../utils/StateContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MenuProject.module.css";
import stylesForm from "../styles/CreateProjectForm.module.css";
import xIcon from "../assets/xIcon.svg";
import rocketPic from "../assets/rocket.svg";
import { useTheme } from "../utils/ThemeContext";

function MenuProject({ project }) {
  const { setprojectId, setShowMenu, selectedIcon, setIcon } =
    useContext(StateContext);

  const { setUpdate } = useContext(StateContext);
  const [clickX, setClickX] = useState(null);
  const [clickY, setClickY] = useState(null);
  const { theme } = useTheme();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (event) => {
    if (show) {
      setShow(false);
    }
    setShow(true);
    setClickX(event.clientX);
    setClickY(event.clientY);
  };

  const navigate = useNavigate();

  const projectClickHandler = (project) => {
    sessionStorage.setItem("projectid", project._id);
    setprojectId(project._id);
    setShowMenu(false);
    navigate("/tasklist");
  };

  const [smShow, setSmShow] = useState(false);
  const handleSmClose = () => setSmShow(false);
  const handleSmShow = () => setSmShow(true);

  const [delShow, setDelShow] = useState(false);
  const handleDelClose = () => setDelShow(false);
  const handleDelShow = () => setDelShow(true);

  const handleSmAllClose = () => {
    handleSmShow(), handleClose();
  };
  const handleDelAllClose = () => {
    handleDelShow(), handleClose();
  };

  const { projectName, icon } = project;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      projectName: "",
      description: "",
    },
  });

  useEffect(() => {
    if (project) {
      setValue("projectName", project.projectName);
      setValue("description", project.description);
      setIcon(project.icon);
    }
  }, [project, setValue]);

  const formSubmitHandler = async (data) => {
    try {
      if (project) {
        await updateData(project._id, { ...data, icon: selectedIcon });
      } else {
        await postData({ ...data, icon: selectedIcon });
      }
      setUpdate((update) => update + 1);
      reset();
      handleSmClose();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      sessionStorage.removeItem("projectid");
      await deleteData(id);
      setUpdate((update) => update + 1);
      navigate("/Projects");
      handleClose();
      handleDelClose();
      setShowMenu(false);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    menuProjectList,
    menuProjectIcon,
    menuProjectName,
    menuProjectProject,
    editIcon,
    menuProjectEditDelete,
    menuProjectModalBackDrop,
    menuEdit,
    menuPencilsquare,
    menuTrash,
    menuTrashIcon,
    menuProjectNameDark,
    menuProjectEditModal,
    menuEditDark,
    menuTrashDark,
  } = styles;

  const {
    modalDialog,
    createProject,
    xIconButton,
    createProjectHeader,
    createProjectForm,
    newProjectName,
    createChooseIcon,
    newProjectDesc,
    createButtons,
    cancelBtn,
    cancelBtnProject,
    createBtnProject,
    cancelBtnContent,
    createBtn,
    createBtnContent,
    rocketPicture,
    rocket,
    rocketSlogan,
    buttonsStupid,
    TextThing12,
    xIconButton1,
    rocketPictureDark,
    xIconButtonDark,
    createProjectFormDark,
    createProjectHeaderDark,
    blankSpace,
    blankSpaceDark,
    createProjectDark,
    projectDescriptionField,
    projectDescriptionFieldDark,
    projectNameField,
    projectNameFieldDark,
    cancelBtnDark,
    createBtnDark,
    TextThing12Dark,
    cancelBtnProjectDark,
    cancelBtnContentDark,
    createBtnProjectDark,
    xIconButton1Dark,
  } = stylesForm;

  return (
    <>
      <div className={menuProjectList}>
        <div
          className={menuProjectList}
          onClick={() => {
            projectClickHandler(project);
          }}
        >
          <img src={icon} alt="icon" className={menuProjectIcon} />
          <p
            className={theme == "light" ? menuProjectName : menuProjectNameDark}
          >
            {projectName}
          </p>
        </div>
        <div className={`Thing ${menuProjectProject}`}>
          <div>
            <ThreeDots className={editIcon} onClick={handleShow} />
          </div>
          {show && (
            <Modal
              className={`myModal ${menuProjectEditDelete}${theme}`}
              // dialogClassName={`myModal modal-content`}
              show={show}
              onHide={handleClose}
              backdropClassName={menuProjectModalBackDrop}
              contentClassName={theme == "light" ? "" : "modal-content-dark"}
              style={{
                top: `${clickY + -500}px`,
                left: `${clickX + -300}px`,
              }}
              backdrop="true"
            >
              <div
                className={theme == "light" ? menuEdit : menuEditDark}
                onClick={handleSmAllClose}
              >
                <PencilSquare className={menuPencilsquare} /> Edit project
              </div>

              <div
                className={theme == "light" ? menuTrash : menuTrashDark}
                onClick={handleDelAllClose}
              >
                <Trash className={menuTrashIcon} /> Delete project
              </div>
            </Modal>
          )}
        </div>

        <Modal
          className={`mySecondModal ${menuProjectEditModal}`}
          show={smShow}
          dialogClassName={modalDialog}
          backdropClassName="backdrop"
          onHide={handleSmClose}
        >
          <div className={theme == "light" ? createProject : createProjectDark}>
            <button
              className={theme == "light" ? xIconButton : xIconButtonDark}
              onClick={handleSmClose}
            >
              <img src={xIcon} alt="xIcon" />
            </button>
            <div className={theme == "light" ? blankSpace : blankSpaceDark}>
              <h1
                className={
                  theme == "light"
                    ? createProjectHeader
                    : createProjectHeaderDark
                }
              >
                Edit your project
              </h1>
              <Form
                onSubmit={handleSubmit(formSubmitHandler)}
                className={
                  theme == "light" ? createProjectForm : createProjectFormDark
                }
              >
                <div>
                  <Form.Group
                    className={newProjectName}
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                      type="textarea"
                      placeholder="New project"
                      name="projectName"
                      // autoComplete="projectName"
                      className={
                        theme == "light"
                          ? projectNameField
                          : projectNameFieldDark
                      }
                      {...register("projectName", {
                        required: "Project name is required",
                        maxLength: {
                          value: 40,
                          message:
                            "Project name is to long, it can't exceed 40 characters",
                        },
                      })}
                      isInvalid={errors.projectName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.projectName && errors.projectName.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div>
                  <p className={createChooseIcon}>Choose your project icon</p>
                  <IconList />
                </div>
                <div>
                  <Form.Group
                    className={newProjectDesc}
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Project description</Form.Label>
                    <Form.Control
                      style={{ resize: "none" }}
                      type="textarea"
                      as="textarea"
                      rows={3}
                      placeholder="Project description"
                      name="description"
                      className={
                        theme == "light"
                          ? projectDescriptionField
                          : projectDescriptionFieldDark
                      }
                      // autoComplete="description"
                      {...register("description", {
                        required: "Project description is required",
                      })}
                      isInvalid={errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description && errors.description.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className={createButtons}>
                  <Button   className={theme == "light" ? cancelBtn : cancelBtnDark} variant="primary">
                    <div onClick={handleSmClose} className={cancelBtnContent}>
                      Cancel
                    </div>
                  </Button>
                  <Button
                    variant="primary"
                    className={theme == "light" ? createBtn : createBtnDark}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <div className={createBtnContent}>Edit</div>
                  </Button>
                </div>
              </Form>
            </div>
            <div
              className={theme == "light" ? rocketPicture : rocketPictureDark}
            >
              <img src={rocketPic} alt="rocketPicture" className={rocket} />
              <h1 className={rocketSlogan}>Ready? Launch!</h1>
            </div>
          </div>
        </Modal>

        <Modal
          className="myDeleteModal"
          show={delShow}
          style={{ top: `${clickY - 160}px`, left: `${clickX - 100}px` }}
          onHide={handleDelClose}
          backdrop="true"
          contentClassName={theme == "light" ? "" : "modal-content-dark"}
        >
          <Modal.Body>
            <div className={theme == "light" ? TextThing12 : TextThing12Dark}>
              Are You sure, you want to delete &quot;{projectName}&quot;?
            </div>
            <button className={theme == "light" ? xIconButton1 : xIconButton1Dark} onClick={handleDelClose}>
              <img src={xIcon} alt="xIcon" />
            </button>
            <div className={buttonsStupid}>
              <Button className={theme == "light" ? cancelBtnProject : cancelBtnProjectDark} onClick={handleDelClose}>
                <div className={theme == "light" ? cancelBtnContent : cancelBtnContentDark}>Cancel</div>
              </Button>
              <Button
                className={theme == "light" ? createBtnProject : createBtnProjectDark}
                onClick={() => handleDelete(project._id)}
              >
                Delete
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default MenuProject;
