import { useState, useCallback, MouseEventHandler } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { parsedData } from '../../interfaces/gemini';
import { checkResponseData, TestResults } from './util';
import './CodeMirror.css';

function IDE(props: parsedData) {
    const { problemName, problemPrompt, testCases, pythonUnitTest, jsUnitTest, defaultPythonFn, defaultJsFn } = props;

    const [value, setValue] = useState<string | undefined>(defaultPythonFn);
    const [userResults, setUserResults] = useState<TestResults | null>(null);
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

            const data: any = await response.json();
            let testResults: any

            if(language !== 'python') {
                testResults = JSON.parse(data.testResults) // additional conversion needed for JavaScript
            } else {
                testResults = data.testResults;
            }

            console.log("TEST RESULTS")
            console.log(testResults)

            const hasDigestibleResults = checkResponseData(testResults);

            if (hasDigestibleResults) {
                setUserResults(testResults);
            } else {
                console.error('An error occured generating test result data');
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
                            {/* // TODO add this back in */}
                            {userResults && userResults.testCase1.assert === true ? (
                                <div>✔ Test Case 1</div>
                            ) : (
                                <div>❌ Test Case 1</div>
                            )}
                            {userResults && userResults.testCase2.assert === true ? (
                                <div>✔ Test Case 2</div>
                            ) : (
                                <div>❌ Test Case 2</div>
                            )}
                            {userResults && userResults.testCase3.assert === true ? (
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
