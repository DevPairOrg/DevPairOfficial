import { useAppSelector } from '../../../hooks';
import IDE from '../../CodeMirror';


const GeminiDSA = () => {
    const geminiProblem = useAppSelector((state) => state.pairedContent.gemini.generatedProblem);

    return (
        <>
            <div id="ide-main-container">
                <IDE
                    problemName={geminiProblem?.problemName}
                    problemPrompt={geminiProblem?.problemPrompt}
                    testCases={geminiProblem?.testCases}
                    pythonUnitTest={geminiProblem?.pythonUnitTest}
                    jsUnitTest={geminiProblem?.jsUnitTest}
                    defaultPythonFn={geminiProblem?.defaultPythonFn}
                    defaultJsFn={geminiProblem?.defaultJsFn}
                />
            </div>
        </>
    );
};

export default GeminiDSA;
