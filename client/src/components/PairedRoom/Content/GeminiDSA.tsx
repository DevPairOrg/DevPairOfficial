import { useAppSelector } from '../../../hooks';
import { ModalProvider } from '../../../context/Modal/Modal';
import IDE from '../../CodeMirror/CodeMirror';


const GeminiDSA = () => {
    const geminiProblem = useAppSelector((state) => state.pairedContent.gemini.generatedProblem);

    return (
        <>
            <div id="ide-main-container">
                <ModalProvider>
                    <IDE
                        problemName={geminiProblem?.problemName}
                        problemPrompt={geminiProblem?.problemPrompt}
                        testCases={geminiProblem?.testCases}
                        pythonUnitTest={geminiProblem?.pythonUnitTest}
                        jsUnitTest={geminiProblem?.jsUnitTest}
                        defaultPythonFn={geminiProblem?.defaultPythonFn}
                        defaultJsFn={geminiProblem?.defaultJsFn}
                    />
                </ModalProvider>
            </div>
        </>
    );
};

export default GeminiDSA;
