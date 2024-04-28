import { useAppSelector } from "../../../hooks";
import IDE from "../../CodeMirror/CodeMirror";

interface GeminiDSAProps {
  channelName?: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const GeminiDSA: React.FC<GeminiDSAProps> = ({ channelName, loading, setLoading }) => {
  const geminiProblem = useAppSelector(
    (state) => state.pairedContent.gemini.generatedProblem
  );

  return (
      <IDE
        problemName={geminiProblem?.problemName}
        problemPrompt={geminiProblem?.problemPrompt}
        testCases={geminiProblem?.testCases}
        pythonUnitTest={geminiProblem?.pythonUnitTest}
        jsUnitTest={geminiProblem?.jsUnitTest}
        defaultPythonFn={geminiProblem?.defaultPythonFn}
        defaultJsFn={geminiProblem?.defaultJsFn}
        channelName={channelName}
        loading={loading}
        setLoading={setLoading}
      />
  );
};

export default GeminiDSA;
