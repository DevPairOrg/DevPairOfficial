import React from 'react';

interface ModalContentProps {
    userResults: any;
    testCaseView: number | null;
    logs: string[] | null;
    setTestCaseView: (value: React.SetStateAction<number | null>) => void
}

const ConsoleOutput: React.FC<ModalContentProps> = ({ userResults, testCaseView, logs, setTestCaseView }) => {
    return (
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

export default ConsoleOutput;
