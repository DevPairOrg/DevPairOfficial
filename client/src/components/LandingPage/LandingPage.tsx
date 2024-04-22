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

    const createSubmissionOnLocal = async () => {
        const url = 'http://146.190.61.177:2358/submissions/?base64_encoded=false&wait=true&fields=*';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'minh',
                'X-Auth-User': 'tran',
                // 'X-Auth-Host': 'http://146.190.61.177:2358',
            },
            body: JSON.stringify({
                source_code: `const input = require('fs').readFileSync(0, 'utf-8').trim().split(' ');
                    const a = parseInt(input[0].split('=')[1]);
                    const b = parseInt(input[1].split('=')[1]);
                    console.log(twoSum(a, b));

                    function twoSum(a, b) {
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

    const handleAbout = async () => {
        const url = 'http://146.190.61.177:2358/about';
        const options = {
            method: 'GET',
            headers: {
                'X-Auth-Token': 'minh',
                'X-Auth-User': 'tran',
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
                    INITIAL ABOUT TEST
                </button>
                <button onClick={createSubmissionOnLocal} style={{ color: 'black', backgroundColor: 'purple' }}>
                    createSubmissionOnLocal
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
