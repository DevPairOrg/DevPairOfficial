import { useState, useCallback, MouseEventHandler } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { FetchRoutes, fetchTestResults } from "../../utility/fetchTestResults";
import "./index.css";

interface TestResult {
  passOrFail?: boolean;
  success?: boolean;
  error?: string;
}

interface Props {
  prompt: string;
  testCases: string;
  pythonUnitTest: string;
  jsUnitTest: string;
  emptyFunctionPython: string;
  emptyFunctionJs: string;
}

function IDE(props: Props) {
  const {
    prompt,
    testCases,
    pythonUnitTest,
    jsUnitTest,
    emptyFunctionPython,
    emptyFunctionJs,
  } = props;

  const [value, setValue] = useState<string>(emptyFunctionPython);
  const [userResults, setUserResults] = useState<boolean[]>([]);
  const [language, setLanguage] = useState<string>("python");

  const onChange = useCallback((val: string) => {
    // console.log('val:', val);
    setValue(val);
  }, []);

  const handleSubmission = async () => {
    const response = await fetch("/api/problem/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        code: value,
        language: language,
        problemUnitTest: language === "python" ? pythonUnitTest : jsUnitTest,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("response from backend", data);
    }
  };

  // Python or Javascript User Options
  const handlePythonButton: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setLanguage("python");
    setValue(emptyFunctionPython);
  };
  const handleJavascriptButton: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setLanguage("javascript");
    setValue(emptyFunctionJs);
  };

  return (
    <>
      <div id="ide-container">
        <div>
          <div>Problem: {prompt && prompt}</div>
          <pre>{testCases && testCases}</pre>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
              height: "auto",
            }}
          >
            <div id="user-results">
              {userResults && userResults[0] === true ? (
                <div>✔ Test Case 1</div>
              ) : (
                <div>❌ Test Case 1</div>
              )}
              {userResults && userResults[1] === true ? (
                <div>✔ Test Case 2</div>
              ) : (
                <div>❌ Test Case 2</div>
              )}
              {userResults && userResults[2] === true ? (
                <div>✔ Test Case 3</div>
              ) : (
                <div>❌ Test Case 3</div>
              )}
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <div>Language: </div>
              <button onClick={handlePythonButton} id="python-button">
                Python
              </button>
              <button onClick={handleJavascriptButton} id="javascript-button">
                JavaScript
              </button>
            </div>
          </div>
          <CodeMirror
            value={value}
            height="400px"
            extensions={
              language === "python" ? [python()] : [javascript({ jsx: true })]
            }
            onChange={onChange}
            theme={dracula}
          />
          <button onClick={handleSubmission} id="ide-submit-button">
            Submit!
          </button>
        </div>
      </div>
    </>
  );
}
export default IDE;
