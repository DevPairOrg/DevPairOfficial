import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import chat1 from '../../assets/images/chat1.png';
{/*
import chat2 from '../../assets/images/chat2.png';
import comic1 from '../../assets/images/comic1.png';
import comic2 from '../../assets/images/comic2.png';
import comic3 from '../../assets/images/comic3.png';
 */}
import PageHeader from '../ScrambleText/ScrambleText';
import './LandingPage.css';
import Footer from '../Footer/Footer';
import { useAppSelector } from '../../hooks';

function LandingPage() {
    const navigate = useNavigate();
    const sessionUser = useAppSelector((state: RootState) => state.session.user);
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

    return (
        <>
            <main className="landing-page">
                <section>
                    {/*<div className="landing-page-cool-image">
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
                    </div>*/}
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
                </section>
                
                <section id="languages-section"> 
                    <div id='language-section-description'>
                            <h2>Technologies we use</h2>

                            <p id='test'>The DevPair community works with a myriad of technologies used both for <span className='accent'>professional</span> and <span className="accent">personal</span> projects, helping each other expand our knowledge about them through collaboration.</p>

                    </div>
                </section>

                <section id='benefits-section'>

                    <div id='benefits-section-description'>
                        <h2>Benefits of working with DevPair</h2>

                        <p>We at DevPair know how hard it can be to break into Data structuring and algorithms, <span className="accent">especially</span> to those with <span className="accent">limited time and resources.</span> That's why we strive to <span className="accent">connect</span> developers around the globe through our community!</p>

                        <p>Because of that, we developed a streamlined way to video call, chat and befriend other developers, <span className="accent"> whenever and wherever</span> you want, in the hopes of not only <span className="accent">improving</span> your <span className="accent">coding</span> skills but also your <span className="accent">social</span> skills, opening up new professional and personal <span className="accent">opportunities!</span></p>
                    </div>
                    
                    <div id='benefits-section-cards'>
                        <div className='benefit-card'>
                            <img src={chat1}></img>
                            <p>Meet new friends and coworkers</p>
                        </div>

                        <div className='benefit-card'>
                            <img src={chat1}></img>
                            <p>Improve your communication skills</p>
                        </div>

                        <div className='benefit-card'>
                            <img src={chat1}></img>
                            <p>Break down social barriers</p>
                        </div>

                        <div className='benefit-card'>
                            <img src={chat1}></img>
                            <p>Improve your coding skills</p>
                        </div>

                    </div>
                </section>

                <section>

                </section>
            </main>
            {/*<Footer />*/}
        </>
    );
}

export default LandingPage;
