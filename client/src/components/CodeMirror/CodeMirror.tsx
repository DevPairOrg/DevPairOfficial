import { useState, MouseEventHandler, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { parsedData } from '../../interfaces/gemini';
import { checkResponseData, TestResults, extractConsoleLogsJavaScriptOnly } from './util';
import { useModal, Modal } from '../../context/Modal/Modal';
import './CodeMirror.css';

function IDE(props: parsedData) {
    const { problemName, problemPrompt, testCases, pythonUnitTest, jsUnitTest, defaultPythonFn, defaultJsFn } = props;

    const [value, setValue] = useState<string | undefined>(defaultPythonFn);
    const [language, setLanguage] = useState<string>('python');
    const [userResults, setUserResults] = useState<TestResults | null>(null);
    const [testCaseView, setTestCaseView] = useState<number | null>(null);
    const [logs, setLogs] = useState<string[] | null>(null); // stoudt console.log statements

    const onChange = (val: string) => {
        setValue(val)

        // extract evaluated console.log statements here (only when language is JavaScript)
        if(language !== 'python') {
            const evaluatedLogStatements = extractConsoleLogsJavaScriptOnly(val)
            setLogs(evaluatedLogStatements)
        }

    };

    useEffect(() => { // change modal content when changing test case view and/or on submission
        if(userResults && testCaseView) {
            openModal()
        }
    }, [testCaseView, userResults]);

    const { setModalContent } = useModal();

    const openModal = () => {
        setModalContent(
            <div id='stoudt-container'>
                <p className={userResults?.testCase1.assert && userResults.testCase2.assert && userResults.testCase3.assert ? 'stoudt-pass' : 'stoudt-fail' }>
                    {userResults?.testCase1.assert && userResults.testCase2.assert && userResults.testCase3.assert ? 'Accepted' : 'Wrong Answer' }
                </p>

                <div id='test-case-swap'>
                    <button onClick={() => setTestCaseView(1)} className="test-case-button" id={testCaseView === 1 ? 'selected-test-case-button' : ''}>
                        <span className={userResults?.testCase1.assert === true ? 'pass-green' : 'fail-red'}>·</span>Case 1
                    </button>

                    <button onClick={() => setTestCaseView(2)} className="test-case-button" id={testCaseView === 2 ? 'selected-test-case-button' : ''}>
                        <span className={userResults?.testCase2.assert === true ? 'pass-green' : 'fail-red'}>·</span>Case 2
                    </button>

                    <button onClick={() => setTestCaseView(3)} className="test-case-button" id={testCaseView === 3 ? 'selected-test-case-button' : ''}>
                        <span className={userResults?.testCase3.assert === true ? 'pass-green' : 'fail-red'}>·</span>Case 3
                    </button>
                </div>

                <div>
                    <div>
                        <p>Output:</p>
                        {testCaseView === 1 && <p>{userResults?.testCase1.userOutput}</p>}
                        {testCaseView === 2 && <p>{userResults?.testCase2.userOutput}</p>}
                        {testCaseView === 3 && <p>{userResults?.testCase3.userOutput}</p>}
                    </div>

                    <div>
                        <p>Expected:</p>
                        {testCaseView === 1 && <p>{userResults?.testCase1.expected}</p>}
                        {testCaseView === 2 && <p>{userResults?.testCase2.expected}</p>}
                        {testCaseView === 3 && <p>{userResults?.testCase3.expected}</p>}
                    </div>

                    <div>
                        <p>Stoudt:</p>
                        { (logs && logs.length !== 0) && <p>{logs}</p> }
                    </div>
                </div>

            </div>
        );
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

            console.log("TEST RESULTS")
            console.log(testResults)

            const hasDigestibleResults = checkResponseData(testResults);

            if (hasDigestibleResults) {
                setUserResults(testResults);
                setTestCaseView(1)
                openModal()
            } else {
                console.error('An error occured generating test result data');
            }

        } catch (error) {
            console.error('An error occurred:', error);
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

    return (
        <>
            <div id="ide-container">
                <Modal></Modal>
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
                    {userResults && <button onClick={openModal} className='show-stoudt-results'>Show Results...</button>}
                </div>
            </div>
        </>
    );
}
export default IDE;
