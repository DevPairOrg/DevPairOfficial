import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import chat1 from '../../assets/images/chat1.png';
import chat2 from '../../assets/images/chat2.png';
import comic1 from '../../assets/images/comic1.png';
import comic2 from '../../assets/images/comic2.png';
import comic3 from '../../assets/images/comic3.png';
import PageHeader from '../ScrambleText/ScrambleText';
import './LandingPage.css';
import Footer from '../Footer/Footer';

function LandingPage() {
    const navigate = useNavigate();
    const sessionUser = useSelector((state: RootState) => state.session.user);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        if (sessionUser && !sessionUser.errors) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [sessionUser]);

    const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate('/signup');
    };

    const handleJoinRoom = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate('/code-collab');
    };

    // ***** LANGUAGE CODES: 71 (python) 63 (javascript) 93(javascript but this one is unavailable on local) *****
    // * Create a submission - use base64_encoded=false&wait=true - wait=true grabs the results and returns it right away instead returning a token for you to use to hit another route to retrieve the results
    // TODO: Figure out how to utilize multiple input / outputs
    // ? Must include Post Method, Auth Token/User/Content-Type
    // ? Body must be JSON.stringify

    // * (Start of important comments)
    // !!! the function stdin is being parsed because although the function being passed in has parameters (a, b) it's actually function twoSum(input) where 'input' is a string intiially
    // Therefore, we have to trim, split the input (stdin) into an array [a, b]
    // Then parse them into integers and reassigning them into proper variables
    // const a = parseInt(input[0]) and const b = parseInt(input[1])
    // Finally we use those variables to match the parameters of function twoSum(a, b)
    // !!! IMPORTANT !!! results will only return correctly if we add a console.log(twoSum(a,b))
    // * (End of important comments)

    // TODO: Figure out an efficient way to have gemini parse this for us intially for the test case, or for it to not have to trim/split/parse and how to do it for arrays
    // TODO: Figure out how to capture console.logs - when console.log is added to the user function and is submitted, it returns in the key 'stdout' along with the return value
    // Example: "stdout": "Test Console Log\n8"
    // ? Maybe tell users to remove console.logs before finalizing their submission (create a 'run' button that is separate from 'submission')

    const createJSSubmissionOnLocal = async () => {
        const url = 'http://146.190.61.177:2358/submissions/?base64_encoded=false&wait=true&fields=*';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': import.meta.env.VITE_X_AUTH_TOKEN,
                'X-Auth-User': import.meta.env.VITE_X_AUTH_USER,
                // 'X-Auth-Host': 'http://146.190.61.177:2358',
            },
            body: JSON.stringify({
                source_code: `const input = require('fs').readFileSync(0, 'utf-8').trim().split(' ');
                    const a = parseInt(input[0].split('=')[1]);
                    const b = parseInt(input[1].split('=')[1]);
                    console.log(twoSum(a, b));

                    function twoSum(a, b) {
                        const sum = a + b
                        console.log('Test Console Log', sum)
                        return a + b;
                    }`,
                language_id: 63,
                stdin: 'a=5 b=3',
                expected_output: '8',
            }),
        };
        try {
            const response = await fetch(url, options as any);
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    // ! For Python: Must Include 'additional_files': sys
    // ! This is so the 'import sys' in the source code actually works correctly
    const createPySubmissionOnLocal = async () => {
        const url = 'http://146.190.61.177:2358/submissions/?base64_encoded=false&wait=true&fields=*';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': import.meta.env.VITE_X_AUTH_TOKEN,
                'X-Auth-User': import.meta.env.VITE_X_AUTH_USER,
                // 'X-Auth-Host': 'http://146.190.61.177:2358',
            },
            body: JSON.stringify({
                additional_files: 'sys',
                // !!! FOR PYTHON YOU HAVE TO USE THIS INDENTATION LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                source_code: `
import sys
def two_sum(a, b):
    sum_value = a + b
    return sum_value

input_data = sys.stdin.read().strip().split(' ')
a = int(input_data[0].split('=')[1])
b = int(input_data[1].split('=')[1])

print(two_sum(a, b))
`,
                language_id: 71,
                stdin: 'a=5 b=3',
                expected_output: '8',
            }),
        };
        try {
            const response = await fetch(url, options as any);
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAbout = async () => {
        const url = 'http://146.190.61.177:2358/about';
        const options = {
            method: 'GET',
            headers: {
                'X-Auth-Token': import.meta.env.VITE_X_AUTH_TOKEN,
                'X-Auth-User': import.meta.env.VITE_X_AUTH_USER,
            },
        };
        try {
            const response = await fetch(url, options as any);
            const result = await response.text();
            console.log(response);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <main className="landing-page">
                <button onClick={handleAbout} style={{ color: 'black' }}>
                    IS THE SERVER RUNNING?
                </button>
                <button onClick={createJSSubmissionOnLocal} style={{ color: 'black', backgroundColor: 'blue' }}>
                    Create JavaScript Submission
                </button>
                <button onClick={createPySubmissionOnLocal} style={{ color: 'black', backgroundColor: 'red' }}>
                    Create Python Submission
                </button>
                <div className="landing-page-cool-image">
                    <div id="cat-one">
                        <img src={chat1} alt="first-cat-sitting-and-coding" className="bouncy-cats-one" />
                    </div>
                    <div className="comix-bubbles-container">
                        <div className="comic-one">
                            <img src={comic1} alt="first-chat-bubble-from-cats" id="comic1-one" />
                        </div>
                        <div className="comic-two">
                            <img src={comic2} alt="second-chat-bubble-from-cats" id="comic2-two" />
                        </div>
                        <div className="comic-three">
                            <img src={comic3} alt="third-chat-bubble-from-cats" id="comic3-three" />
                        </div>
                    </div>
                    <div className="second-cat-div">
                        <img src={chat2} alt="second-cat-sitting-and-coding" id="cat-two" className="bouncy-cats-two" />
                    </div>
                </div>
                <div className="landing-page-description">
                    <PageHeader title="DevPair!" />
                    <>
                        <div className="landing-text-one">
                            <span className="accent">Connect</span> and collaborate with developers worldwide
                        </div>
                        <div className="landing-text-two">
                            <span className="accent">Grind</span> DS&A questions to enhance your skills
                        </div>
                        <div className="landing-text-three">
                            <span className="accent">Unleash</span> Your Developer Potential!
                        </div>
                    </>
                    {loggedIn ? (
                        <button className="landing-page-get-started" onClick={handleJoinRoom}>
                            Join a Room!
                        </button>
                    ) : (
                        <button className="landing-page-get-started" onClick={handleGetStarted}>
                            Get Started
                        </button>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default LandingPage;
