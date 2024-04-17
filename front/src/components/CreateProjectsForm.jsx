import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { postData } from "../services/post";
import IconList from "../components/IconList";
import "../styles/projectsList.css";
import "../styles/createProjectsForm.css"

function CreateProjectForm() {
  const [error, setError] = useState("");
  const [icon, setIcon] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      projectName: "",
      description: "",
    },
  });

  const formSubmitHandler = async (data) => {
    try {
      await postData({ ...data, icon: icon });
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <>
      <div className="create-project">
        <h1 className="H12">Create a new project</h1>
        <Form onSubmit={handleSubmit(formSubmitHandler)} className="create-project--form">
          <div>
            <Form.Group
              className="NewProjectName"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="textarea"
                placeholder="New project"
                autoComplete="projectName"
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
            <p className="create-choose--icon">Choose your project icon</p>
            <IconList setIcon={setIcon} />
          </div>
          <div>
            <Form.Group
              className="NewProjectDesc"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Project description</Form.Label>
              <Form.Control
                type="textarea"
                placeholder="Project description"
                autoComplete="description"
                {...register("description",
                  {
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
            <Button
              className="cancelBtn"
              variant="primary"
              onClick={() => close()}
            >
              <div className="cancelBtnContent">Cancel</div>
            </Button>
            <Button
              variant="primary"
              // style={{
              //   backgroundColor: "#3fadbe",
              //   border: "#3fadbe",
              //   marginLeft: "30.5px",
              //   width: "79px",
              //   height: "32px",
              // }}
              className="createBtn"
              type="submit"
              disabled={isSubmitting}
            >
              <div className="createBtnContent">Create</div>
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default CreateProjectForm;