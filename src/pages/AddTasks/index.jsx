import React, { useState, useRef } from "react";
import styles from "./AddTasks.module.css";
import { useSelector } from "react-redux";
import axios from "../../axios.js";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

function AddTasks() {
  const { data } = useSelector((state) => state.auth);
  const [text, setText] = useState("");
  const [departmentText, setDepartmentText] = useState("");
  const [workerText, setWorkerText] = useState("");
  const [isListeningPersonal, setIsListeningPersonal] = useState(false);
  const [isListeningDepartment, setIsListeningDepartment] = useState(false);
  const [isListeningWorker, setIsListeningWorker] = useState(false);
  const [selectedLanguagePersonal, setSelectedLanguagePersonal] =
    useState("en-US");
  const [selectedLanguageDepartment, setSelectedLanguageDepartment] =
    useState("en-US");
  const [selectedLanguageWorker, setSelectedLanguageWorker] = useState("en-US");
  const [isLanguageMenuOpenPersonal, setIsLanguageMenuOpenPersonal] =
    useState(false);
  const [isLanguageMenuOpenDepartment, setIsLanguageMenuOpenDepartment] =
    useState(false);
  const [isLanguageMenuOpenWorker, setIsLanguageMenuOpenWorker] =
    useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileUrlDepartment, setFileUrlDepartment] = useState("");
  const inputFileRef = useRef(null);
  const inputFileRefDepartment = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileNameDepartment, setFileNameDepartment] = useState("");

  const recognizerRefPersonal = useRef(null);
  const recognizerRefDepartment = useRef(null);
  const recognizerRefWorker = useRef(null);

  const languageOptions = [
    { label: "English (US)", value: "en-US" },
    { label: "Russian (RU)", value: "ru-RU" },
    { label: "German (DE)", value: "de-DE" },
    { label: "Polish (PL)", value: "pl-PL" },
    { label: "Spanish (ES)", value: "es-ES" },
  ];

  const toggleSpeechRecognition = (type) => {
    if (type === "personal") {
      handleSpeechRecognition(
        isListeningPersonal,
        setIsListeningPersonal,
        recognizerRefPersonal,
        setText,
        selectedLanguagePersonal
      );
    } else if (type === "department") {
      handleSpeechRecognition(
        isListeningDepartment,
        setIsListeningDepartment,
        recognizerRefDepartment,
        setDepartmentText,
        selectedLanguageDepartment
      );
    } else if (type === "worker") {
      handleSpeechRecognition(
        isListeningWorker,
        setIsListeningWorker,
        recognizerRefWorker,
        setWorkerText,
        selectedLanguageWorker
      );
    }
  };

  const handleSpeechRecognition = (
    isListening,
    setListening,
    recognizerRef,
    setText,
    language
  ) => {
    if (isListening) {
      recognizerRef.current.stopContinuousRecognitionAsync(() => {
        recognizerRef.current.close();
        recognizerRef.current = null;
        setListening(false);
      });
    } else {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        "9rvHeR55d9d6Q4VjLcnM4SQhR9oZjvQfyxfpJUAspeEH424Bo7x9JQQJ99AKACPV0roXJ3w3AAAYACOGonfA",
        "germanywestcentral"
      );

      speechConfig.speechRecognitionLanguage = language;
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizerRef.current = recognizer;
      setListening(true);

      recognizer.recognized = (s, e) => {
        if (
          e.result.reason === sdk.ResultReason.RecognizedSpeech &&
          e.result.text
        ) {
          setText((prevText) => prevText + e.result.text + " ");
        }
      };

      recognizer.canceled = () => {
        setListening(false);
        recognizer.stopContinuousRecognitionAsync();
      };

      recognizer.startContinuousRecognitionAsync();
    }
  };

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      setFileName(file.name);
      formData.append("file", file);
      const { data } = await axios.post("api/upload", formData);
      setFileUrl(data.url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeFileDepartment = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      setFileNameDepartment(file.name);
      formData.append("file", file);
      const { data } = await axios.post("api/upload", formData);
      setFileUrlDepartment(data.url);

      console.log(data.url);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (text) => {
    const field = { text, fileUrl };
    console.log(field);
    const { data } = await axios.post("api/createPersonalTask", field);

    console.log(data);
  };
  const onSubmitDepartment = async (text) => {
    console.log(fileUrlDepartment);

    const field = { text, fileUrlDepartment };
    const { data } = await axios.post("api/createPersonalTask", field);

    console.log(data);
  };

  console.log(fileUrlDepartment);

  return (
    <div className={styles.container} id="dashboardContainer">
      {data?.role === "manager" ? (
        <div id="managerSection">
          <h3>Dodaj zadanie dla działu:</h3>
          <div className={styles.languageDropdownWrapper}>
            <button
              className={styles.languageButton}
              onClick={() => setIsLanguageMenuOpenDepartment((prev) => !prev)}
            >
              {languageOptions.find(
                (option) => option.value === selectedLanguageDepartment
              )?.label || "Select Language"}
              <span className={styles.arrow}>
                {isLanguageMenuOpenDepartment ? "▲" : "▼"}
              </span>
            </button>
            {isLanguageMenuOpenDepartment && (
              <ul className={styles.languageDropdownMenu}>
                {languageOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`${styles.languageOption} ${
                      option.value === selectedLanguageDepartment
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedLanguageDepartment(option.value);
                      setIsLanguageMenuOpenDepartment(false);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => toggleSpeechRecognition("department")}
            className={styles.microphoneButton}
          >
            {isListeningDepartment ? "Stop Listening" : "Start Listening"}
          </button>
          <textarea
            id="taskInput"
            placeholder="Opisz zadanie"
            value={departmentText}
            onChange={(e) => setDepartmentText(e.target.value)}
          ></textarea>
          <input
            ref={inputFileRefDepartment}
            type="file"
            onChange={handleChangeFileDepartment}
            hidden
          />
          <button
            className={styles.img__button}
            onClick={() => inputFileRefDepartment.current.click()}
          >
            {fileNameDepartment || "Add File"}
          </button>
          <button
            id="addDepartmentTask"
            onClick={() => onSubmitDepartment(departmentText)}
          >
            Dodaj zadanie
          </button>

          <h3>Osobiste zadania kierownika:</h3>
          <div className={styles.languageDropdownWrapper}>
            <button
              className={styles.languageButton}
              onClick={() => setIsLanguageMenuOpenPersonal((prev) => !prev)}
            >
              {languageOptions.find(
                (option) => option.value === selectedLanguagePersonal
              )?.label || "Select Language"}
              <span className={styles.arrow}>
                {isLanguageMenuOpenPersonal ? "▲" : "▼"}
              </span>
            </button>
            {isLanguageMenuOpenPersonal && (
              <ul className={styles.languageDropdownMenu}>
                {languageOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`${styles.languageOption} ${
                      option.value === selectedLanguagePersonal
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedLanguagePersonal(option.value);
                      setIsLanguageMenuOpenPersonal(false);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => toggleSpeechRecognition("personal")}
            className={styles.microphoneButton}
          >
            {isListeningPersonal ? "Stop Listening" : "Start Listening"}
          </button>
          <textarea
            id="personalManagerTaskInput"
            placeholder="Dodaj osobiste zadanie"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <input
            ref={inputFileRef}
            type="file"
            onChange={handleChangeFile}
            hidden
          />
          <button
            className={styles.img__button}
            onClick={() => inputFileRef.current.click()}
          >
            {fileName || "Add File"}
          </button>
          <button id="addPersonalManagerTask" onClick={() => onSubmit(text)}>
            Dodaj osobiste zadanie
          </button>
        </div>
      ) : (
        <div id="workerSection">
          <h3>Osobiste zadania pracownika:</h3>
          <div className={styles.languageDropdownWrapper}>
            <button
              className={styles.languageButton}
              onClick={() => setIsLanguageMenuOpenWorker((prev) => !prev)}
            >
              {languageOptions.find(
                (option) => option.value === selectedLanguageWorker
              )?.label || "Select Language"}
              <span className={styles.arrow}>
                {isLanguageMenuOpenWorker ? "▲" : "▼"}
              </span>
            </button>
            {isLanguageMenuOpenWorker && (
              <ul className={styles.languageDropdownMenu}>
                {languageOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`${styles.languageOption} ${
                      option.value === selectedLanguageWorker
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedLanguageWorker(option.value);
                      setIsLanguageMenuOpenWorker(false);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => toggleSpeechRecognition("worker")}
            className={styles.microphoneButton}
          >
            {isListeningWorker ? "Stop Listening" : "Start Listening"}
          </button>
          <textarea
            id="personalWorkerTaskInput"
            placeholder="Dodaj osobiste zadanie"
            value={workerText}
            onChange={(e) => setWorkerText(e.target.value)}
          ></textarea>
          <input
            ref={inputFileRef}
            type="file"
            onChange={handleChangeFile}
            hidden
          />
          <button
            className={styles.img__button}
            onClick={() => inputFileRef.current.click()}
          >
            Add Image
          </button>
          <button
            id="addPersonalWorkerTask"
            onClick={() => onSubmit(workerText)}
          >
            Dodaj osobiste zadanie
          </button>
        </div>
      )}
    </div>
  );
}

export default AddTasks;
