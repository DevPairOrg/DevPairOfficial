import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { parsedData } from '../../interfaces/gemini';
import { TestResults, extractConsoleLogsJavaScriptOnly, handleCodeSubmission, handleJavascriptButton, handlePythonButton } from './util';
import { useModal, Modal } from '../../context/Modal/Modal';
import ConsoleOutput from './ConsoleOutput';
import './CodeMirror.css';

function IDE(props: parsedData) {
    const { problemName, problemPrompt, testCases, pythonUnitTest, jsUnitTest, defaultPythonFn, defaultJsFn } = props;
    const { setModalContent } = useModal();

    const [value, setValue] = useState<string | undefined>(defaultPythonFn); // value of user code inside of IDE
    const [language, setLanguage] = useState<string>('python'); // language for IDE

    const [userResults, setUserResults] = useState<TestResults | null>(null); // user results object on submission
    const [testCaseView, setTestCaseView] = useState<number | null>(null); // switch which test case your looking at
    const [logs, setLogs] = useState<string[] | null>(null); // stoudt console.log statements

    useEffect(() => { // update modal content when needed
        if(userResults && testCaseView) {
            openConsoleOutputModal()
        }
    }, [testCaseView, userResults]);


    function parsedTestCases(testCases: string | undefined) {
        if(testCases) {
            const parseByNewLine = testCases?.trim()?.split("\n")

            const firstInputLine = parseByNewLine[0]
            const secondInputLine = parseByNewLine[2]
            const thirdInputLine = parseByNewLine[4]


            let testCase1ParamsLine = firstInputLine.split("- INPUT:")
            let testCase2ParamsLine = secondInputLine.split("- INPUT:")
            let testCase3ParamsLine = thirdInputLine.split("- INPUT:")

            testCase1ParamsLine = testCase1ParamsLine.splice(1, testCase1ParamsLine.length)
            testCase2ParamsLine = testCase2ParamsLine.splice(1, testCase2ParamsLine.length)
            testCase3ParamsLine = testCase3ParamsLine.splice(1, testCase3ParamsLine.length)

            const paramsTestCase1 = testCase1ParamsLine.join("").trim()
            const paramsTestCase2 = testCase2ParamsLine.join("").trim()
            const paramsTestCase3 = testCase3ParamsLine.join("").trim()

            console.log({paramsTestCase1, paramsTestCase2, paramsTestCase3})
            return {paramsTestCase1, paramsTestCase2, paramsTestCase3}
        }
    }

    parsedTestCases(testCases)


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
