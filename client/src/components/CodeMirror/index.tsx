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
}

function IDE(props: Props) {
  const { prompt, testCases, pythonUnitTest, jsUnitTest } = props;

  const [value, setValue] = useState<string>("# Your Python Code Here");
  const [userResults, setUserResults] = useState<boolean[]>([]);
  const [language, setLanguage] = useState<string>("python");

  const onChange = useCallback((val: string) => {
    // console.log('val:', val);
    setValue(val);
  }, []);

  //   const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
  //     e.preventDefault();
  //     const results = await fetchTestResults(value, problemId, language);
  //     // console.log('Finished Fetching...', results);

  //     // Handles All Edge Cases if there are errors, then return the state as false for correct rendering of elements
  //     if (results && results.results[0].error) {
  //       setUserResults(
  //         results.results.map((result: TestResult) => {
  //           if (result.error) return false;
  //         })
  //       );
  //     }

  //     // Main Test Case
  //     if (results && results.results && !results.results[0].error) {
  //       // console.log('😁😁😁 results', results.results);
  //       setUserResults(
  //         results.results.map((result: TestResult) => result.passOrFail)
  //       );
  //     }
  //   };

  const handleSubmission = async () => {
    const response = await fetch("/api/problem/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    setValue("# Your Python Code Here");
  };
  const handleJavascriptButton: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setLanguage("javascript");
    setValue("// Your JavaScript Code Here");
  };

  return (
    <>
      <div id="ide-container">
        <h1>Problem: {prompt && prompt}</h1>
        <pre>{testCases && testCases}</pre>
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
          height="600px"
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
    </>
  );
}
export default IDE;
