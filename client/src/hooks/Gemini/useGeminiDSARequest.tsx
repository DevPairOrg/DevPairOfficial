import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '..';
import { generateAndSetGeminiProblem } from '../../store/pairedContent';
import { parseCode } from '../../utility/parseGeminiResponse';

const useGeminiDSARequest = () => {
    const dispatch = useAppDispatch();
    const sessionUser = useAppSelector((state) => state.session.user);
    const [loading, setLoading] = useState<boolean>(false); // This state is for UX to render something while the request is still loading/processing
    const [error, setError] = useState<string>('');

    const handleGeminiDSARequest = async () => {
        if (!sessionUser) {
            console.error('Error: No signed in user');
            return;
        }

        setLoading(true);
        const res = await fetch(`/api/gemini/generate/${Number(sessionUser.id)}`); // GENERATE LEETCODE PROBLEM
        setLoading(false);

        if (res.ok) {
            const data = await res.json();
            console.log(data)
            // addQuestionPromptToUserModel(data.geminiResponse);
            const parsedGeminiResponse = {
                problemName: data.geminiResponse["PROBLEM NAME"],
                problemPrompt: data.geminiResponse["QUESTION PROMPT"],
                testCases: data.geminiResponse["TEST CASES"],
                pythonUnitTest: data.geminiResponse["PYTHON_UNIT_TEST"],
                jsUnitTest: data.geminiResponse["JAVASCRIPT_UNIT_TEST"],
                defaultPythonFn: data.geminiResponse["PYTHON FUNCTION SIGNATURE"],
                defaultJsFn: data.geminiResponse["JAVASCRIPT FUNCTION SIGNATURE"]
            };
            
            dispatch(generateAndSetGeminiProblem({ isActive: true, generatedProblem: parsedGeminiResponse }));
        } else {
            console.error('Failed to generate a problem through Gemini API.');
            setError('Failed to generate a problem.');
        }
    };

    const addQuestionPromptToUserModel = async (questionPrompt: string) => {
        if (!sessionUser) {
            console.error('Error adding question prompt to user model. No signed in user');
            return;
        }

        const res = await fetch('/api/gemini/add', {
            method: 'POST',
            body: JSON.stringify({ userId: sessionUser.id, prompt: questionPrompt }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            console.error('Error adding question prompt to user model');
        }
    };

    return { handleGeminiDSARequest, loading, error };
};

export default useGeminiDSARequest;
