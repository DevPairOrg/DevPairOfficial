import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '..';
import { generateAndSetGeminiProblem, resetGeminiState } from '../../store/pairedContent';
import { useSocket } from '../../context/Socket';

export interface ParsedGeminiResponse {
    problemName: any;
    problemPrompt: any;
    testCases: any;
    pythonUnitTest: any;
    jsUnitTest: any;
    defaultPythonFn: any;
    defaultJsFn: any;
}

const useGeminiDSARequest = (channelName: string | undefined) => {
    const { socket, connectSocket, error } = useSocket();

    const dispatch = useAppDispatch();
    const sessionUser = useAppSelector((state) => state.session.user);
    const [loading, setLoading] = useState<boolean>(false); // This state is for UX to render something while the request is still loading/processing
    const [fetchError, setFetchError] = useState<string>('');

    if (error) console.log('Error in useGeminiDSARequest: ', error);
    useEffect(() => {
        if (!socket) {
            connectSocket();
        }
    }, [socket, connectSocket]);


    // handle received
    const handleSendUsersToGeminiDSAComponentReceived = useCallback(
        (data: {parsedGeminiResponse: ParsedGeminiResponse}) => {
            dispatch(generateAndSetGeminiProblem({ isActive: true, generatedProblem: data.parsedGeminiResponse }));
        },
        [dispatch]
    );

    // handle send
    const sendUsersToGeminiDSAComponent = useCallback(
        (parsedGeminiResponse: ParsedGeminiResponse) => {

            socket?.emit('send_users_to_gemini_dsa_component', {
                fetchData: parsedGeminiResponse,
                room: (channelName as string),
            });
        },
        [socket, channelName]
    );

    // attach listeners for sockets
    useEffect(() => {
        if (socket && !socket.hasListeners('send_users_to_gemini_dsa_component_received')) {
            socket.on('send_users_to_gemini_dsa_component_received', handleSendUsersToGeminiDSAComponentReceived);

            // Clean up: Detach the event listener and dispatch action to clear states messages when unmounting
            return () => {
                socket.off('send_users_to_gemini_dsa_component_received', handleSendUsersToGeminiDSAComponentReceived);
                dispatch(resetGeminiState())
            };
        }
    }, [dispatch, handleSendUsersToGeminiDSAComponentReceived, socket]);


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
            const parsedGeminiResponse: ParsedGeminiResponse = {
                problemName: data.geminiResponse["PROBLEM NAME"],
                problemPrompt: data.geminiResponse["QUESTION PROMPT"],
                testCases: data.geminiResponse["TEST CASES"],
                pythonUnitTest: data.geminiResponse["PYTHON_UNIT_TESTS"],
                jsUnitTest: data.geminiResponse["JAVASCRIPT_UNIT_TESTS"],
                defaultPythonFn: data.geminiResponse["PYTHON FUNCTION SIGNATURE"],
                defaultJsFn: data.geminiResponse["JAVASCRIPT FUNCTION SIGNATURE"]
            };

            sendUsersToGeminiDSAComponent(parsedGeminiResponse)
            // dispatch(generateAndSetGeminiProblem({ isActive: true, generatedProblem: parsedGeminiResponse }));
        } else {
            console.error('Failed to generate a problem through Gemini API.');
            setFetchError('Failed to generate a problem.');
        }
    };

    // const addQuestionPromptToUserModel = async (questionPrompt: string) => {
    //     if (!sessionUser) {
    //         console.error('Error adding question prompt to user model. No signed in user');
    //         return;
    //     }

    //     const res = await fetch('/api/gemini/add', {
    //         method: 'POST',
    //         body: JSON.stringify({ userId: sessionUser.id, prompt: questionPrompt }),
    //         headers: { 'Content-Type': 'application/json' },
    //     });

    //     if (!res.ok) {
    //         console.error('Error adding question prompt to user model');
    //     }
    // };

    return { handleGeminiDSARequest, loading, error: fetchError };
};



export default useGeminiDSARequest;
