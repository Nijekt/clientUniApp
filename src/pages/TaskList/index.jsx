import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTask,
  fetchTasks,
  updateTaskStatus,
} from "../../redux/slices/tasksSlice";
import cross from "../../assets/cross.svg";
import styles from "./TaskList.module.css";
import Translator from "../../components/Translator";

const TakList = () => {
  const dispatch = useDispatch();
  const { items: tasks } = useSelector((state) => state.tasks.tasks);
  const { data } = useSelector((state) => state.auth);

  console.log(data);

  const [translatedTexts, setTranslatedTexts] = useState({}); // Объект для хранения переводов
  const [selectedLanguages, setSelectedLanguages] = useState({}); // Объект для хранения выбранных языков

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const handleChangeStatus = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleTranslate = (taskId, translatedText) => {
    setTranslatedTexts((prev) => ({ ...prev, [taskId]: translatedText }));
  };

  const handleLanguageChange = (taskId, language) => {
    setSelectedLanguages((prev) => ({ ...prev, [taskId]: language }));
  };

  const filteredTasksByUser = tasks.filter(
    (item) => item.user?._id === data?._id
  );

  const filteredTasksByDepartment = tasks.filter(
    (item) => item?.department === data?.department
  );

  const filteredForManager = tasks.filter(
    (item) => item.user?._id === data?._id && !item.department
  );

  console.log("By man", filteredForManager);

  console.log("By dep: ", filteredTasksByDepartment);
  console.log("By user: ", filteredTasksByUser);

  return (
    <>
      {data?.role == "worker" ? (
        <>
          <h2>Zadania osobiste:</h2>
          <ul className={styles.tasks__list}>
            {filteredTasksByUser.map((item) => (
              <li
                key={item._id}
                className={`${styles.task__element} ${
                  item.status === "completed" ? styles.completed : ""
                }`}
              >
                <div className={styles.upper}>
                  <Translator
                    onTranslate={(text) => handleTranslate(item._id, text)}
                    text={item.text}
                    onLanguageChange={(lang) =>
                      handleLanguageChange(item._id, lang)
                    }
                  />
                  <img
                    style={{ width: "10px" }}
                    src={cross}
                    className={styles.dlt}
                    onClick={() => handleDeleteTask(item._id)}
                  />
                </div>
                <div className={styles.text__task}>
                  {translatedTexts[item._id] || item.text}
                </div>
                <section className={styles.section}>
                  <span className={styles.download}>
                    {item.fileUrl ? (
                      <a href={item.fileUrl}>Download file</a>
                    ) : (
                      ""
                    )}
                  </span>
                  <select
                    className={styles.select}
                    value={item.status}
                    onChange={(e) =>
                      handleChangeStatus(item._id, e.target.value)
                    }
                  >
                    <option value="in-progress">W toku</option>
                    <option value="completed">Zakończono</option>
                  </select>
                </section>
              </li>
            ))}
          </ul>
          <h2>Zadania dla działu:</h2>
          <ul className={styles.tasks__list}>
            {filteredTasksByDepartment.map((item) => (
              <li
                key={item._id}
                className={`${styles.task__element} ${
                  item.status === "completed" ? styles.completed : ""
                }`}
              >
                <div className={styles.upper}>
                  <Translator
                    onTranslate={(text) => handleTranslate(item._id, text)}
                    text={item.text}
                    onLanguageChange={(lang) =>
                      handleLanguageChange(item._id, lang)
                    }
                  />
                  <img
                    style={{ width: "10px" }}
                    src={cross}
                    className={styles.dlt}
                    onClick={() => handleDeleteTask(item._id)}
                  />
                </div>
                <div className={styles.text__task}>
                  {translatedTexts[item._id] || item.text}
                </div>
                <section className={styles.section}>
                  <span className={styles.download}>
                    {item.fileUrlDepartment ? (
                      <a href={item.fileUrlDepartment}>Download file</a>
                    ) : (
                      ""
                    )}
                  </span>
                  <select
                    className={styles.select}
                    value={item.status}
                    onChange={(e) =>
                      handleChangeStatus(item._id, e.target.value)
                    }
                  >
                    <option value="in-progress">W toku</option>
                    <option value="completed">Zakończono</option>
                  </select>
                </section>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>Zadania osobiste:</h2>
          <ul className={styles.tasks__list}>
            {filteredForManager.map((item) => (
              <li
                key={item._id}
                className={`${styles.task__element} ${
                  item.status === "completed" ? styles.completed : ""
                }`}
              >
                <div className={styles.upper}>
                  <Translator
                    onTranslate={(text) => handleTranslate(item._id, text)}
                    text={item.text}
                    onLanguageChange={(lang) =>
                      handleLanguageChange(item._id, lang)
                    }
                  />
                  <img
                    style={{ width: "10px" }}
                    src={cross}
                    className={styles.dlt}
                    onClick={() => handleDeleteTask(item._id)}
                  />
                </div>
                <div className={styles.text__task}>
                  {translatedTexts[item._id] || item.text}
                </div>
                <section className={styles.section}>
                  <span className={styles.download}>
                    {item.fileUrl ? (
                      <a href={item.fileUrl}>Download file</a>
                    ) : (
                      ""
                    )}
                  </span>
                  <select
                    className={styles.select}
                    value={item.status}
                    onChange={(e) =>
                      handleChangeStatus(item._id, e.target.value)
                    }
                  >
                    <option value="in-progress">W toku</option>
                    <option value="completed">Zakończono</option>
                  </select>
                </section>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default TakList;
