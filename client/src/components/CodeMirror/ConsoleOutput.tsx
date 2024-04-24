import React from 'react';
import { JudgeResults } from './util';

interface ModalContentProps {
    userResults: JudgeResults | null;
    testCaseView: number | null;
    setTestCaseView: (value: React.SetStateAction<number | null>) => void
}

const ConsoleOutput: React.FC<ModalContentProps> = ({ userResults, testCaseView, setTestCaseView }) => {
    return (
        <div id='stoudt-container'>
            <p className={
                userResults?.testCase1.assert
                && userResults.testCase2.assert
                && userResults.testCase3.assert
                ? 'stoudt-pass' : 'stoudt-fail'
            }>
                {userResults?.testCase1.assert
                && userResults.testCase2.assert
                && userResults.testCase3.assert
                ? 'Accepted' : 'Wrong Answer'
                }
            </p>

            <div id='test-case-swap'>
                <button onClick={() => setTestCaseView(1)} className="test-case-button" id={testCaseView === 1 ? 'selected-test-case-button' : ''}>
                    <span className={userResults?.testCase1.assert ? 'pass-green' : 'fail-red'}>·</span>Case 1
                </button>

                <button onClick={() => setTestCaseView(2)} className="test-case-button" id={testCaseView === 2 ? 'selected-test-case-button' : ''}>
                    <span className={userResults?.testCase2.assert ? 'pass-green' : 'fail-red'}>·</span>Case 2
                </button>

                <button onClick={() => setTestCaseView(3)} className="test-case-button" id={testCaseView === 3 ? 'selected-test-case-button' : ''}>
                    <span className={userResults?.testCase3.assert ? 'pass-green' : 'fail-red'}>·</span>Case 3
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
                    {testCaseView === 1 && <p>{userResults?.testCase1.expectedOutput}</p>}
                    {testCaseView === 2 && <p>{userResults?.testCase2.expectedOutput}</p>}
                    {testCaseView === 3 && <p>{userResults?.testCase3.expectedOutput}</p>}
                </div>

                <div>
                    <p>Stoudt:</p>
                    {testCaseView === 1 && <p>{userResults?.testCase1.stdout}</p>}
                    {testCaseView === 2 && <p>{userResults?.testCase2.stdout}</p>}
                    {testCaseView === 3 && <p>{userResults?.testCase3.stdout}</p>}
                </div>
            </div>
        </div>
    );
};

export default ConsoleOutput;
