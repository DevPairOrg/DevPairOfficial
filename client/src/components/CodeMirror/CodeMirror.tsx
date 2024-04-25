import { useState, useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { parsedData } from '../../interfaces/gemini';
import { useSocket } from '../../context/Socket';
import {
    handleJavascriptButton,
    handlePythonButton,
    handleJudgeSubmission,
    JudgeResults,
    seperateLogsAndUserOutputFromStdout,
    assertResults,
    allTestCasesPassed,
    addDSAProblemToUserSolved
} from '../../utility/CodeMirrorHelpers/codeMirrorhelpers';

import { useModal, Modal } from '../../context/Modal/Modal';
import ConsoleOutput from './ConsoleOutput';
import './CodeMirror.css';
import { useAppSelector } from '../../hooks';

function IDE(props: parsedData) {
    const { socket, connectSocket, error } = useSocket();

    const user = useAppSelector((state) => state.session.user)
    const { problemName, problemPrompt, testCases, defaultPythonFn, defaultJsFn, channelName } = props;
    const { setModalContent } = useModal();

    const [value, setValue] = useState<string | undefined>(defaultPythonFn); // value of user code inside of IDE
    const [language, setLanguage] = useState<string>('python'); // language for IDE

    const [userResults, setUserResults] = useState<JudgeResults | null>(null); // user results object on submission
    const [testCaseView, setTestCaseView] = useState<number | null>(null); // switch which test case your looking at

    useEffect(() => {
        // update modal content when needed
        if (userResults && testCaseView) {
            openConsoleOutputModal();
        }
    }, [testCaseView, userResults]);

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
    };

    return (
        <>
            <div id="ide-container">
                <Modal></Modal> {/*This is needed for the Modal UI to render in */}
                <div>
                    <div>Problem Name: {problemName && problemName}</div>
                    <div>Prompt: {problemPrompt && problemPrompt}</div>
                    <pre>
                        {testCases &&
                            testCases.map((entry) => {
                                return (
                                    <>
                                        <div key={Math.random()}>INPUT: {entry.INPUT}</div>
                                        <div key={Math.random()}>OUTPUT: {entry.OUTPUT}</div>
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
                        onClick={ async() => {
                            const judgeResults: JudgeResults | undefined = await handleJudgeSubmission(value, language, testCases)
                            if(judgeResults) {
                                // manually seperate out debugging statements and result assertions
                                seperateLogsAndUserOutputFromStdout(judgeResults)
                                assertResults(judgeResults)

                                // handle ConsoleOutput modal
                                setUserResults(judgeResults)
                                openConsoleOutputModal()
                                setTestCaseView(1)

                                // if user has solved problem, append it to the user's solved
                                if(allTestCasesPassed(judgeResults)) {
                                    addDSAProblemToUserSolved(user?.id, problemName)
                                }
                            }
                        }}
                        id="ide-submit-button"
                        style={{ color: 'red' }}
                    >
                        Submit
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
