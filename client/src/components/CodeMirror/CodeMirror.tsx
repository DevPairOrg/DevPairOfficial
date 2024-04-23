import { useState, useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { parsedData } from '../../interfaces/gemini';
import { useSocket } from '../../context/Socket';
import {
    TestResults,
    // extractConsoleLogsJavaScriptOnly,
    handleCodeSubmission,
    handleJavascriptButton,
    handlePythonButton,
    TestParams,
    parsedTestCases,
    createJSSubmissionOnLocal,
    createPySubmissionOnLocal,
    handleJudgeSubmission,
} from './util';

import { useModal, Modal } from '../../context/Modal/Modal';
import ConsoleOutput from './ConsoleOutput';
import './CodeMirror.css';

function IDE(props: parsedData) {
    const { socket, connectSocket, error } = useSocket();

    const {
        problemName,
        problemPrompt,
        testCases,
        pythonUnitTest,
        jsUnitTest,
        defaultPythonFn,
        defaultJsFn,
        channelName,
    } = props;
    const { setModalContent } = useModal();

    const [value, setValue] = useState<string | undefined>(defaultPythonFn); // value of user code inside of IDE
    const [language, setLanguage] = useState<string>('python'); // language for IDE
    const [params, setParams] = useState<TestParams | {}>({}); // gathers all the parameters for each test case

    const [userResults, setUserResults] = useState<TestResults | null>(null); // user results object on submission
    const [testCaseView, setTestCaseView] = useState<number | null>(null); // switch which test case your looking at
    const [logs, setLogs] = useState<string[] | null>(null); // stoudt console.log statements

    useEffect(() => {
        // update modal content when needed
        if (userResults && testCaseView) {
            openConsoleOutputModal();
        }
    }, [testCaseView, userResults]);

    useEffect(() => {
        setParams(parsedTestCases(testCases));
    }, []);

    if (error) console.log('Error in IDE Component: ', error);
    useEffect(() => {
        if (!socket) {
            connectSocket();
        }
    }, [socket, connectSocket]);

    const openConsoleOutputModal = () => {
        // opens the console output modal

        setModalContent(
            <ConsoleOutput
                userResults={userResults}
                testCaseView={testCaseView}
                logs={logs}
                setTestCaseView={setTestCaseView}
            />
        );
    };

    // handle received
    const handleIDEReceived = useCallback((data: { newValue: string }) => {
        setValue(data.newValue);
    }, []);

    // handle send
    const updateIDERealTime = useCallback(
        (value: string) => {
            console.log('UPDATE IDE...');
            socket?.emit('update_IDE', {
                newValue: value,
                room: channelName as string,
            });
        },
        [socket, value, channelName]
    );

    useEffect(() => {
        if (socket && !socket.hasListeners('update_IDE_received')) {
            socket.on('update_IDE_received', handleIDEReceived);

            // Clean up: Detach the event listener and dispatch action to clear states messages when unmounting
            return () => {
                socket.off('update_IDE_received', handleIDEReceived);
            };
        }
    }, [handleIDEReceived, socket]);

    const onChange = (value: string) => {
        // NOTE* onChange function for react code mirror automatically takes in value param which is the IDE value string
        setValue(value);
        updateIDERealTime(value);

        // extract evaluated console.log statements here (only when language is JavaScript)
        // if (language !== "python" && value) {
        //   const evaluatedLogStatements = extractConsoleLogsJavaScriptOnly(value);
        //   setLogs(evaluatedLogStatements);
        // }
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
                    <pre>
                        {testCases &&
                            testCases.map((entry) => {
                                return (
                                    <>
                                        <div>INPUT: {entry.INPUT}</div>
                                        <div>OUTPUT: {entry.OUTPUT}</div>
                                    </>
                                );
                            })}
                    </pre>
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
                            <button
                                onClick={(e) => handlePythonButton(e, setLanguage, setValue, defaultPythonFn)}
                                id="python-button"
                            >
                                Python
                            </button>
                            <button
                                onClick={(e) => handleJavascriptButton(e, setLanguage, setValue, defaultJsFn)}
                                id="javascript-button"
                            >
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
                    <button
                        onClick={async () => {
                            handleJudgeSubmission(value, jsUnitTest, language, pythonUnitTest, true);
                        }}
                        id="ide-submit-button"
                    >
                        Submit Code
                    </button>
                    {userResults && (
                        <button onClick={openConsoleOutputModal} className="show-stoudt-results">
                            Show Results...
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default IDE;
