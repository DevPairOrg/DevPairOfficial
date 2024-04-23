import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { parsedData } from '../../interfaces/gemini';
import {
    TestResults,
    extractConsoleLogsJavaScriptOnly,
    handleCodeSubmission,
    handleJavascriptButton,
    handlePythonButton,
    TestParams,
    parsedTestCases,
    createJSSubmissionOnLocal,
    createPySubmissionOnLocal
} from './util';

import { useModal, Modal } from '../../context/Modal/Modal';
import ConsoleOutput from './ConsoleOutput';
import './CodeMirror.css';

function IDE(props: parsedData) {
    const { problemName, problemPrompt, testCases, pythonUnitTest, jsUnitTest, defaultPythonFn, defaultJsFn } = props;
    const { setModalContent } = useModal();

    const [value, setValue] = useState<string | undefined>(defaultPythonFn); // value of user code inside of IDE
    const [language, setLanguage] = useState<string>('python'); // language for IDE
    const [params, setParams] = useState<TestParams | {}>({}) // gathers all the parameters for each test case

    const [userResults, setUserResults] = useState<TestResults | null>(null); // user results object on submission
    const [testCaseView, setTestCaseView] = useState<number | null>(null); // switch which test case your looking at
    const [logs, setLogs] = useState<string[] | null>(null); // stoudt console.log statements

    useEffect(() => { // update modal content when needed
        if(userResults && testCaseView) {
            openConsoleOutputModal()
        }
    }, [testCaseView, userResults]);

    useEffect(() => {
        setParams(parsedTestCases(testCases))
    }, [])


    const openConsoleOutputModal = () => { // opens the console output modal
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


    return (
        <>
            <div id="ide-container">
                <Modal></Modal> {/* This is needed for the Modal UI to render in */}
                <button onClick={() => parsedTestCases(testCases)}>TEST</button>
                <button onClick={() => createJSSubmissionOnLocal()}>JAVASCRIPT SUBMISSION</button>
                <button onClick={() => createPySubmissionOnLocal()}>PYTHON SUBMISSION</button>
                <div>
                    <div>Problem Name: {problemName && problemName}</div>
                    <div>Prompt: {problemPrompt && problemPrompt}</div>
                    <pre>{testCases && (testCases.map(entry => {
                        return (
                            <>
                            <div>INPUT: {entry.INPUT}</div>
                            <div>OUTPUT: {entry.OUTPUT}</div>
                            </>
                        )
                    }))}</pre>
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
                            <button onClick={(e) => handlePythonButton(e, setLanguage, setValue, defaultPythonFn)} id="python-button">
                                Python
                            </button>
                            <button onClick={(e) => handleJavascriptButton(e, setLanguage, setValue, defaultJsFn)} id="javascript-button">
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
                    <button onClick={ async() => {
                        handleCodeSubmission(
                            (value || undefined),
                            (jsUnitTest || undefined),
                            language,
                            (pythonUnitTest || undefined),
                            setUserResults,
                            setTestCaseView,
                            openConsoleOutputModal
                            )
                        } } id="ide-submit-button">
                        Submit Code
                    </button>
                    {userResults && <button onClick={openConsoleOutputModal} className='show-stoudt-results'>Show Results...</button>}
                </div>
            </div>
        </>
    );
}

export default IDE;
