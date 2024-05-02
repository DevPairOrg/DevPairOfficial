import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

{/*Language Icons*/}
import flask from '../../assets/images/flask-logo.png'
import react from '../../assets/images/react-logo.png'
import python from '../../assets/images/python-logo.png'
import redux from '../../assets/images/redux-logo.png'
import agora from '../../assets/images/Agora.png'
import gemini from '../../assets/images/gemini-logo.png'

{/*Images*/}
import bannerImg from '../../assets/images/banner-img.png'
import meetFriends from '../../assets/images/meet-friends.png'
import improveSocial from '../../assets/images/improve-socials.png'
import improveCoding from '../../assets/images/improve-coding.png'
import breakBarrier from '../../assets/images/break-barriers.png'
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
                <section id='header-section'>
                    <div id="imgBanner">
                        <img src={bannerImg} alt="Image of a circle filled with wavy green lines. On top of it there are simple icons representing people connected via a straight line downward to the lines inside the circle." />
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
                </section>
                
                <section id="languages-section"> 
                    <div id='language-section-description'>
                            <h2>Technologies we use</h2>

                            <p id='test'>The DevPair community works with a myriad of technologies used both for <span className='accent'>professional</span> and <span className="accent">personal</span> projects, helping each other expand our knowledge about them through collaboration.</p>
                    </div>

                    <div id='languages-lineup'>
                        <div className='languages-card'>
                            <img alt='Flask icon' src={flask}  id='flask'/>
                            <p>Flask Socket.io</p>
                        </div>
                        <div className='languages-card'>
                            <img alt='React Icon' src={react}  />
                            <p>React</p>
                        </div>
                        <div className='languages-card'>
                            <img alt='Python Icon' src={python}/>
                            <p>Python</p>
                        </div>
                        <div className='languages-card'>
                            <img alt='Resux Icon' src={redux} id='redux' />
                            <p>Redux</p>
                        </div>
                        <div className='languages-card'>
                            <img alt='Gemini Icon' src={gemini} id='gemini'/>
                            <p>Gemini</p>
                        </div>
                        <div className='languages-card'>
                            <img alt='Agora Icon' src={agora} id='agora' />
                            <p>Agora</p>
                        </div>

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
                            <img alt='Green lined icon image depicting two simple humanoid figures high-fiving.' src={meetFriends}></img>
                            <p>Meet new friends and coworkers</p>
                        </div>

                        <div className='benefit-card'>
                            <img alt='Green lined icon image depicting a humanoid figure surrounded by speech bubbles.' src={improveSocial}></img>
                            <p>Improve your communication skills</p>
                        </div>

                        <div className='benefit-card'>
                            <img alt='Green lined icon image depicting a chain link being broken.' src={breakBarrier}></img>
                            <p>Break down social barriers</p>
                        </div>

                        <div className='benefit-card'>
                            <img alt='Green lined icon image depicting a humanoid figure typing on a laptop with one hand raised holding a lightbulb.' src={improveCoding}></img>
                            <p>Improve your coding skills</p>
                        </div>

                    </div>
                </section>

                <section id='call-to-action-section'>
                    <div id='call-to-action'>
                        <div>
                            <h2>Join our community!</h2>
                            <p>Start expanding your horizons today</p>
                        </div>
                        
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
                   
                <Footer />
            </main>
        </>
    );
}

export default LandingPage;
