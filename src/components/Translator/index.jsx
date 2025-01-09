import React, { useState } from "react";
import axios from "axios";
import styles from "./Translator.module.css";

const Translator = ({ text, onTranslate, onLanguageChange }) => {
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);

  const languageOptions = [
    { label: "Russian", value: "ru" },
    { label: "Spanish", value: "es" },
    { label: "German", value: "de" },
    { label: "French", value: "fr" },
    { label: "Polish", value: "pl" },
    { label: "English", value: "en" },
  ];

  const handleTranslate = async () => {
    if (!text) {
      console.error("Text for translation is missing.");
      return;
    }
    setIsLoading(true);

    const apiKey =
      "6T1YrYg733C59QscdCJ6cDLANbRmgzznKJHW59iv2xK8QjFjjsTaJQQJ99AKACPV0roXJ3w3AAAbACOGNtFf";
    const region = "germanywestcentral";
    const endpoint =
      "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

    try {
      const response = await axios.post(
        `${endpoint}&to=${targetLanguage}`,
        [{ Text: text }],
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": region,
            "Content-Type": "application/json",
          },
        }
      );

      const translatedText = response.data[0].translations[0].text;
      onTranslate(translatedText);
      onLanguageChange(targetLanguage);
    } catch (error) {
      console.error("Translation error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setTargetLanguage(selectedLang);
    onLanguageChange(selectedLang);
  };

  return (
    <div>
      <select
        className={styles.select}
        value={targetLanguage}
        onChange={handleLanguageChange}
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        className={styles.dlt}
        onClick={handleTranslate}
        disabled={isLoading}
      >
        {isLoading ? "Tłumaczenie..." : "Tłumacz"}
      </button>
    </div>
  );
};

export default Translator;
