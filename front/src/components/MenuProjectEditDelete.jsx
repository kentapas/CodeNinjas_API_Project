import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import IconList from "../components/IconList";
import { StateContext } from "../utils/StateContext";
import { useContext } from "react";
import { Trash, PencilSquare } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import styles from "../styles/MenuProject.module.css";
import { useForm } from "react-hook-form";
import { deleteData } from "../services/delete";
import { postData } from "../services/post";
import { updateData } from "../services/update";

function MenuProjectEditDelete({project}) {
    const { setUpdate, showEdit, setShowEdit } = useContext(StateContext)
    
    const handleClose = () => setShowEdit(false);
  
    const [smShow, setSmShow] = useState(false);
    const handleSmClose = () => setSmShow(false);
    const handleSmShow = () => setSmShow(true);
  
    const [delShow, setDelShow] = useState(false);
    const handleDelClose = () => setDelShow(false);
    const handleDelShow = () => setDelShow(true);
  
    const handleSmAllClose = () => { handleSmShow(), handleClose() };
    const handleDelAllClose = () => { handleDelShow(), handleClose() };

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
        }
      }, [project]);
    
      const formSubmitHandler = async (data) => {
        try {
          if (project) {
            await updateData(project._id, data);
          } else {
            await postData({ ...data, icon: icon });
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
          await deleteData(id);
          setUpdate((update) => update + 1);
          handleClose();
          handleDelClose();
        } catch (error) {
          console.log(error);
        }
      }
      
    const {menuProjectModalBackDrop, menuEdit, menuPencilsquare, menuTrash, menuTrashIcon} = styles;

    
    return(
        <>
        <Modal
        className="myModal"
        show={showEdit} onHide={handleClose} backdropClassName={menuProjectModalBackDrop}>
          <div className={menuEdit} onClick={handleSmAllClose}>
            <PencilSquare className={menuPencilsquare} /> Edit project
          </div>

          <div className={menuTrash} onClick={handleDelAllClose}>
            <Trash className={menuTrashIcon}/> Delete project
          </div>
        </Modal>

        <Modal className="mySecondModal" show={smShow} >
          <div className="create-project">
            <h1 className="H12">Edit your project</h1>
            <Form
              onSubmit={handleSubmit(formSubmitHandler)}
              className="create-project--form"
            >
              <div>
                <Form.Group
                  className="NewProjectName"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="textarea"
                    placeholder="New project"
                    name="projectName"
                    // autoComplete="projectName"
                    {...register("projectName", {
                      required: "Project name is required",
                    })}
                    isInvalid={errors.projectName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.projectName && errors.projectName.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div>
                <p className="create-choose--icon">
                  Choose your project icon
                </p>
                <IconList />
              </div>
              <div>
                <Form.Group
                  className="NewProjectDesc"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Project description</Form.Label>
                  <Form.Control
                    type="textarea"
                    as="textarea"
                    rows={3}
                    placeholder="Project description"
                    name="description"
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
              <div className="CreateButtons">
                <Button className="cancelBtn" variant="primary">
                  <div onClick={handleSmClose} className="cancelBtnContent">
                    Cancel
                  </div>
                </Button>
                <Button
                  variant="primary"
                  className="createBtn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <div className="createBtnContent">
                    Edit
                  </div>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>


        <Modal
          className="myDeleteModal"
          show={delShow}
        >
          <Modal.Body>
            Are You sure, you want to delete {projectName}?
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancelBtn" onClick={handleDelClose}>
              <div className="cancelBtnContent">Cancel</div>
            </Button>
            <Button className="createBtn" onClick={() => handleDelete(project._id)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
    </>
    )
}

export default MenuProjectEditDelete;