import Table from "react-bootstrap/Table";
import "../styles/taskListTable.css";
import { useForm } from "react-hook-form";
import { postDataTask } from "../services/post";
import { useContext, useState, useEffect, useRef } from "react";
import { StateContext } from "../utils/StateContext";
import styles from "../styles/StatusDropdown.module.css";
import styles2 from "../styles/PriorityDropdown.module.css";
import Ownerstyles from "../styles/Owner.module.css";
import taskListStyles from "../styles/TaskListTable.module.css";
import tableFormStyles from "../styles/TaskListTableForm.module.css";
import { PersonCircle, CircleFill } from "react-bootstrap-icons";
import TaskListTableTimeLine from "./TaskListTableTimeLine";
import { getOne } from "../services/get";
import { createPopper } from "@popperjs/core";
import { useTheme } from "../utils/ThemeContext";

function TaskListTableForm({
  selectedTimeLine,
  setSelectedTimeLine,
  setSelectedCreationDay,
  selectedCreationDay,
  selectedCompletionDay,
}) {
  const { tasks, setUpdate, showTask, setShowTask, projectId } =
    useContext(StateContext);

  // const [isOpen, setIsOpen] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  // const [open, setOpen] = useState(false);

  const { theme } = useTheme();

  //Priority
  // const [isOpens, setIsOpens] = useState({});
  // const [opens, setOpens] = useState(false);
  const [isOpenPriority, setIsOpenPriority] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");

  // Owner
  // const [isOpeno, setIsOpeno] = useState(false);
  // const [isOpenos, setIsOpenos] = useState(false);
  const [isOpenOwner, setIsOpenOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedOwnerColor, setSelectedOwnerColor] = useState("");
  const [ownerColor, setOwnerColor] = useState("");
  const [ownerColors, setOwnerColors] = useState([]);
  const [getInfo, setProjectInfo] = useState("");

  const statusRef = useRef();
  const priorityRef = useRef();
  const ownerRef = useRef();
  const statusMenuRef = useRef();
  const priorityMenuRef = useRef();
  const ownerMenuRef = useRef();

  const getMembersNames = async () => {
    let projectData = await getOne(projectId);
    let getInfo = projectData.data.project;
    setProjectInfo(getInfo);
  };

  const getStartFixedDate = (date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

  useEffect(() => {
    getMembersNames();
    setSelectedCreationDay(getStartFixedDate(new Date()));
  }, [projectId]);

  useEffect(() => {
    const generateOwnerColors = () => {
      const colors = [
        Ownerstyles.ownerIconWater,
        Ownerstyles.ownerIconOrange,
        Ownerstyles.ownerIconGrape,
        Ownerstyles.ownerIconBlue,
        Ownerstyles.ownerIconPink,
      ];
      let index = 0;
      return (ownerList) => {
        return ownerList.map(() => {
          const color = colors[index];
          index = (index + 1) % colors.length;
          return color;
        });
      };
    };

    const owners = [
      "Peter Pan",
      "Alice Wonderland",
      "Tom Sawyer",
      "Mirabel Madrigal",
      "John Doe",
    ];
    const assignColor = generateOwnerColors();
    setOwnerColors(assignColor(owners));
  }, []);

  const handleOwnerClick = (owner, color) => {
    setSelectedOwner(owner);
    const fixedColor = color.match(/_([^_]+)_/)[1];
    setOwnerColor(fixedColor);
    setSelectedOwnerColor(color);
    setIsOpenOwner(false);
  };
  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setIsOpenStatus(false);
  };

  const handlePriorityClick = (priority) => {
    setSelectedPriority(priority);
    setIsOpenPriority(false);
  };

  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");
    return initials.toUpperCase();
  };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      key: "",
      task: "",
      owner: "",
      status: "",
      priority: "",
      timeline: "",
      creationdate: "",
      completiondate: "",
    },
  });

  const formSubmitHandler = async (data) => {
    try {
      await postDataTask({
        ...data,
        status: selectedStatus,
        priority: selectedPriority,
        owner: [selectedOwner, ownerColor],
        timeline: selectedTimeLine,
        creationdate: selectedCreationDay,
        completiondate: selectedCompletionDay,
        projectId: projectId,
      });
      setUpdate((update) => update + 1);
      setShowTask(false);
      reset();
      setSelectedStatus("");
      setSelectedPriority("");
      setSelectedOwner("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOutside = (event) => {
    if (
      statusRef.current &&
      !statusRef.current.contains(event.target) &&
      statusMenuRef.current &&
      !statusMenuRef.current.contains(event.target)
    ) {
      setIsOpenStatus(false);
    }
    if (
      priorityRef.current &&
      !priorityRef.current.contains(event.target) &&
      priorityMenuRef.current &&
      !priorityMenuRef.current.contains(event.target)
    ) {
      setIsOpenPriority(false);
    }
    if (
      ownerRef.current &&
      !ownerRef.current.contains(event.target) &&
      ownerMenuRef.current &&
      !ownerMenuRef.current.contains(event.target)
    ) {
      setIsOpenOwner(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpenStatus) {
      createPopper(statusRef.current, statusMenuRef.current, {
        placement: "bottom",
      });
    }
    if (isOpenPriority) {
      createPopper(priorityRef.current, priorityMenuRef.current, {
        placement: "bottom",
      });
    }
    if (isOpenOwner) {
      createPopper(ownerRef.current, ownerMenuRef.current, {
        placement: "bottom",
      });
    }
  }, [isOpenStatus, isOpenPriority, isOpenOwner]);

  const {
    tableBody,
    tableHeaderKey,
    tableHeaderKeyDark,
    keyNameDark,
    ownerBtnDark,
    keyName,
    priorityBtnDark,
    statusBtnDark,
    tableTimelineDark,
    tasklistTaskField,
    tasklistTaskFieldDark,
    tableHeaderCompletionDateDark,
    tableHeaderCreationDateDark,
    tableHeaderOwnerThDark,
    tableHeaderOwnerTh,
    TaskListTableFormBackground,
    TaskListTableFormBackgroundDark,
    tableHeaderOwner,
    tableHeaderStatusTh,
    tableHeaderStatus,
    tableHeaderPriorityTh,
    tableHeaderPriority,
    tableTimeline,
    tableHeaderCreationDate,
    taskCreationDate,
    tableHeaderCompletionDate,
    taskCompletionDate,
    ownerMenuDark,
    statusMenuDark,
    statusMenu,
  } = taskListStyles;

  const {
    taskNameForm,
    taskOwner,
    taskOwnerDark,
    taskStatus,
    taskPriority,
    taskNameFormDark,
  } = tableFormStyles;

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(formSubmitHandler)}>
          <Table bordered>
            <tbody className={tableBody}>
              <tr>
                <td
                  className={
                    theme == "light" ? tableHeaderKey : tableHeaderKeyDark
                  }
                >
                  <p
                    className={theme == "light" ? keyName : keyNameDark}
                    id="key"
                    name="key"
                    type="text"
                    {...register("key")}
                  >
                    {tasks.key}
                  </p>
                </td>
                <td
                  className={
                    theme == "light" ? tasklistTaskField : tasklistTaskFieldDark
                  }
                >
                  <input
                    className={
                      theme == "light" ? taskNameForm : taskNameFormDark
                    }
                    id="task"
                    name="task"
                    type="text"
                    {...register("task")}
                  />
                </td>
                <td
                  className={
                    theme == "light"
                      ? tableHeaderOwnerTh
                      : tableHeaderOwnerThDark
                  }
                >
                  <div className={tableHeaderOwner}>
                    <div
                      className={theme == "light" ? taskOwner : taskOwnerDark}
                      ref={ownerRef}
                    >
                      <button
                        type="button"
                        onClick={() => setIsOpenOwner(!isOpenOwner)}
                        className={
                          theme == "light"
                            ? Ownerstyles.ownerBtn
                            : Ownerstyles.ownerBtnDark
                        }
                      >
                        {selectedOwner ? (
                          <div className={Ownerstyles.initials}>
                            <CircleFill className={selectedOwnerColor} />
                            <div>{getInitials(selectedOwner)}</div>
                          </div>
                        ) : (
                          <PersonCircle
                            className={Ownerstyles.ownerIconEmpty}
                          />
                        )}
                      </button>
                      {isOpenOwner && (
                        <div
                          ref={ownerMenuRef}
                          className={
                            theme == "light"
                              ? Ownerstyles.ownerMenu
                              : Ownerstyles.ownerMenuDark
                          }
                        >
                          <div className={Ownerstyles.ownerList}>
                            {getInfo &&
                              getInfo.members.map((member, index) => (
                                <div
                                  className={Ownerstyles.circleIcon}
                                  key={index}
                                  onClick={() =>
                                    handleOwnerClick(
                                      member.names,
                                      ownerColors[index]
                                    )
                                  }
                                >
                                  <div className={Ownerstyles.initialsList}>
                                    <CircleFill
                                      className={ownerColors[index]}
                                    />
                                    <div>{getInitials(member.names)}</div>
                                    <span>{member.names}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className={tableHeaderStatusTh}>
                  <div className={tableHeaderStatus}>
                    <div className={taskStatus} ref={statusRef}>
                      <button
                        type="button"
                        onClick={() => setIsOpenStatus(!isOpenStatus)}
                        className={`${
                          theme == "light"
                            ? styles.statusBtn
                            : styles.statusBtnDark
                        } ${selectedStatus && styles.selected}`}
                        style={{
                          backgroundColor:
                            selectedStatus === "To do"
                              ? "#3372b2"
                              : selectedStatus === "In progress"
                              ? "#7f5db6"
                              : selectedStatus === "Done"
                              ? "#00a167"
                              : "",
                        }}
                      >
                        {selectedStatus || String.fromCharCode(9662)}
                      </button>
                      {isOpenStatus && (
                        <div
                          ref={statusMenuRef}
                          className={
                            theme == "light"
                              ? styles.statusMenu
                              : styles.statusMenuDark
                          }
                        >
                          <p
                            className={styles.statusDo}
                            onClick={() => handleStatusClick("To do")}
                          >
                            To do
                          </p>
                          <p
                            className={styles.statusProgress}
                            onClick={() => handleStatusClick("In progress")}
                          >
                            In progress
                          </p>
                          <p
                            className={styles.statusDone}
                            onClick={() => handleStatusClick("Done")}
                          >
                            Done
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className={tableHeaderPriorityTh}>
                  <div className={tableHeaderPriority}>
                    <div className={taskPriority} ref={priorityRef}>
                      <button
                        type="button"
                        onClick={() => setIsOpenPriority(!isOpenPriority)}
                        className={`${
                          theme == "light"
                            ? styles2.priorityBtn
                            : styles2.priorityBtnDark
                        } ${
                          selectedPriority &&
                          (selectedPriority === "Low"
                            ? styles2.selectedPrioLow
                            : selectedPriority === "Medium"
                            ? styles2.selectedPrioMed
                            : selectedPriority === "High"
                            ? styles2.selectedPrioHi
                            : "")
                        }`}
                        style={{
                          backgroundColor:
                            selectedPriority === "Low"
                              ? "#40ADBE"
                              : selectedPriority === "Medium"
                              ? "#FDAB3D"
                              : selectedPriority === "High"
                              ? "#C0417F"
                              : "",
                        }}
                      >
                        {selectedPriority || String.fromCharCode(9662)}
                      </button>
                      {isOpenPriority && (
                        <div
                          ref={priorityMenuRef}
                          className={theme == "light" ? styles2.priorityMenu : styles2.priorityMenuDark}
                        >
                          <p
                            className={styles2.priorityLow}
                            onClick={() => handlePriorityClick("Low")}
                          >
                            Low
                          </p>
                          <p
                            className={styles2.priorityMedium}
                            onClick={() => handlePriorityClick("Medium")}
                          >
                            Medium
                          </p>
                          <p
                            className={styles2.priorityHigh}
                            onClick={() => handlePriorityClick("High")}
                          >
                            High
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td
                  className={
                    theme == "light" ? tableTimeline : tableTimelineDark
                  }
                >
                  <TaskListTableTimeLine
                    setSelectedTimeLine={setSelectedTimeLine}
                    selectedTimeLine={selectedTimeLine}
                  />
                </td>
                <td
                  className={
                    theme == "light"
                      ? tableHeaderCreationDate
                      : tableHeaderCreationDateDark
                  }
                >
                  <p
                    className={taskCreationDate}
                    style={{ border: "none" }}
                    id="creationdate"
                    name="creationdate"
                    type="text"
                    {...register("creationdate")}
                  ></p>
                </td>
                <td
                  className={
                    theme == "light"
                      ? tableHeaderCompletionDate
                      : tableHeaderCompletionDateDark
                  }
                >
                  <p
                    className={taskCompletionDate}
                    id="completiondate"
                    name="completiondate"
                    type="text"
                    {...register("completiondate")}
                  ></p>
                </td>
              </tr>
            </tbody>
          </Table>
          <input style={{ display: "none" }} type="submit" />
        </form>
      </div>
    </>
  );
}

export default TaskListTableForm;