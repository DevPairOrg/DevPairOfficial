import { useState, useCallback, MouseEventHandler } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { parsedData } from '../../interfaces/gemini';
import './CodeMirror.css';

function IDE(props: parsedData) {
    const { problemName, problemPrompt, testCases, pythonUnitTest, jsUnitTest, defaultPythonFn, defaultJsFn } = props;

    const [value, setValue] = useState<string | undefined>(defaultPythonFn);
    const [userResults, setUserResults] = useState<boolean[]>([]);
    const [language, setLanguage] = useState<string>('python');

    const onChange = useCallback((val: string) => {
        // console.log('val:', val);
        setValue(val);
    }, []);

    const handleSubmission = async () => {
        try {
            const response = await fetch('/api/problem/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    code: value,
                    language: language,
                    problemUnitTest: language === 'python' ? pythonUnitTest : jsUnitTest,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // console.log('response from backend', data);

            if (data.testResults && typeof data.testResults === 'object') {
                const testResultsArray = Object.values(data.testResults);

                // Ensure all elements are boolean before setting the state
                const areAllBooleans = testResultsArray.every((result) => typeof result === 'boolean');
                if (areAllBooleans) {
                    setUserResults(testResultsArray as boolean[]);
                } else {
                    console.error('Not all test results are booleans.');
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    // useEffect(() => {
    //     console.log('userResults', userResults);
    // });

    // Python or Javascript User Options
    const handlePythonButton: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        setLanguage('python');
        setValue(defaultPythonFn);
    };
    const handleJavascriptButton: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        setLanguage('javascript');
        setValue(defaultJsFn);
    };

    return (
        <>
            <div id="ide-container">
                <div>
                    <div>Problem Name: {problemName && problemName}</div>
                    <div>Prompt: {problemPrompt && problemPrompt}</div>
                    <pre>{testCases && testCases}</pre>
                </div>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                            height: 'auto',
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
                        <div style={{ display: 'flex', gap: '5px' }}>
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
                        extensions={language === 'python' ? [python()] : [javascript({ jsx: true })]}
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
