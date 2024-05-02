import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '..';
import { generateAndSetGeminiProblem, resetGeminiState } from '../../store/pairedContent';
import { useSocket } from '../../context/Socket';
import { toast } from 'react-toastify';

export interface ParsedGeminiResponse {
    problemName: any;
    problemPrompt: any;
    testCases: any;
    pythonUnitTest: any;
    jsUnitTest: any;
    defaultPythonFn: any;
    defaultJsFn: any;
}

// TOASTIFY
const notifyError = () => toast.error('Failed to generate a problem... please try again', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark"
    });

const notifyBeta = () => toast.info('Hang tight! Our AI is hard at work crafting a challenging problem for you. This feature is currently in BETA.', {
    position: "bottom-left",
    autoClose: 9000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });

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
        notifyBeta()

        setLoading(true);
        const res = await fetch(`/api/gemini/generate/${Number(sessionUser.id)}`); // GENERATE LEETCODE PROBLEM
        setLoading(false);

        if (res.ok) {
            const data = await res.json();
            // console.log(data)
            // addQuestionPromptToUserModel(data.geminiResponse);
            const parsedGeminiResponse: ParsedGeminiResponse = {
                problemName: data.geminiResponse["PROBLEM NAME"],
                problemPrompt: data.geminiResponse["QUESTION PROMPT"],
                testCases: data.geminiResponse["TEST CASES"],
                pythonUnitTest: data.geminiResponse["PYTHON_UNIT_TEST"],
                jsUnitTest: data.geminiResponse["JAVASCRIPT_UNIT_TEST"],
                defaultPythonFn: data.geminiResponse["PYTHON FUNCTION SIGNATURE"],
                defaultJsFn: data.geminiResponse["JAVASCRIPT FUNCTION SIGNATURE"]
            };

            // dispatch(generateAndSetGeminiProblem({ isActive: true, generatedProblem: parsedGeminiResponse }));

            sendUsersToGeminiDSAComponent(parsedGeminiResponse)

        } else {
            notifyError()

            console.error('Failed to generate a problem through Gemini API.');
            setFetchError('Failed to generate a problem.');
        }
    };

    return { handleGeminiDSARequest, loading, error: fetchError };
};



export default useGeminiDSARequest;
