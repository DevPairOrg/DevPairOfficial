import { useState, MouseEventHandler, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { parsedData } from '../../interfaces/gemini';
import { checkResponseData, TestResults, extractConsoleLogsJavaScriptOnly } from './util';
import { useModal, Modal } from '../../context/Modal/Modal';
import ConsoleOutput from './ConsoleOutput';
import './CodeMirror.css';

function IDE(props: parsedData) {
    const { problemName, problemPrompt, testCases, pythonUnitTest, jsUnitTest, defaultPythonFn, defaultJsFn } = props;
    const { setModalContent } = useModal();

    const [value, setValue] = useState<string | undefined>(defaultPythonFn);
    const [language, setLanguage] = useState<string>('python');

    const [userResults, setUserResults] = useState<TestResults | null>(null);
    const [testCaseView, setTestCaseView] = useState<number | null>(null);
    const [logs, setLogs] = useState<string[] | null>(null); // stoudt console.log statements

    useEffect(() => { // update modal content when needed
        if(userResults && testCaseView) {
            openConsoleOutputModal()
        }
    }, [testCaseView, userResults]);


    const openConsoleOutputModal = () => { // opens the console output
        setModalContent(
            <ConsoleOutput
                userResults={userResults}
                testCaseView={testCaseView}
                logs={logs}
                setTestCaseView={setTestCaseView}
            />
        );
    };

    const onChange = (value: string) => { // NOTE* onChange function for react code mirror automatically takes in value param which is the IDE value string
        setValue(value)

        // extract evaluated console.log statements here (only when language is JavaScript)
        if(language !== 'python' && value) {
            const evaluatedLogStatements = extractConsoleLogsJavaScriptOnly(value)
            setLogs(evaluatedLogStatements)
        }
    };

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

    const handleSubmission = async (val: string | undefined) => {
        let valWithoutLogs;
        if (language === 'javascript' && val) {
            // Remove console.log statements from the function definition for JavaScript
            valWithoutLogs = val.replace(/console\.log\s*\([^]*?\)\s*;?/g, '')
        }

        try {
            const response = await fetch('/api/problem/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    code: language !== 'python' ? valWithoutLogs : value, // do not pass console.log to backend if your using JavaScript IDE
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

            const hasDigestibleResults = checkResponseData(testResults);

            if (hasDigestibleResults) {
                setUserResults(testResults);
                setTestCaseView(1)
                openConsoleOutputModal()
            } else {
                console.error('An error occured generating test result data');
            }

        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <>
            <div id="ide-container">
                <Modal></Modal> {/* This is needed for the Modal UI to render in */}
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
                    <button onClick={() => handleSubmission(value || undefined)} id="ide-submit-button">
                        Submit Code
                    </button>
                    {userResults && <button onClick={openConsoleOutputModal} className='show-stoudt-results'>Show Results...</button>}
                </div>
            </div>
        </>
    );
}

export default IDE;
