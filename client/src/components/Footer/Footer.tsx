import './Footer.css';
import GitHubIcon from '../../assets/icons/svg/github.svg';
import LinkedInIcon from '../../assets/icons/svg/linkedin.svg';
//should change github and linkedin names to icons

function Footer() {
    return (
        <footer className="all-developers">
            <div className="developer-container">
                <div className="developer-name">Minh Tran</div>
                <div className="developer-links-container">
                    <div className="developer-github">
                        <a className="github" href="https://github.com/itsmingyoo" target="_blank">
                            <img src={GitHubIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                    <div className="developer-linkedin">
                        <a className="linkedin" href="https://www.linkedin.com/in/minh-tran-36501a251" target="_blank">
                            <img src={LinkedInIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="developer-container">
                <div className="developer-name">Mariana Reynaga</div>
                <div className="developer-links-container">
                    <div className="developer-github">
                        <a className="github" href="https://github.com/maru-reyna" target="_blank">
                            <img src={GitHubIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                    <div className="developer-linkedin">
                        <a className="linkedin" href="https://www.linkedin.com/in/mariana-r-2a4a58256/" target="_blank">
                            <img src={LinkedInIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="developer-container">
                <div className="developer-name">Melinda Cortez</div>
                <div className="developer-links-container">
                    <div className="developer-github">
                        <a className="github" href="https://github.com/Solita43" target="_blank">
                            <img src={GitHubIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                    <div className="developer-linkedin">
                        <a
                            className="linkedin"
                            href="https://www.linkedin.com/in/melinda-cortez-3581b0139/"
                            target="_blank"
                        >
                            <img src={LinkedInIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="developer-container">
                <div className="developer-name">Sebastian Stovell</div>
                <div className="developer-links-container">
                    <div className="developer-github">
                        <a className="github" href="https://github.com/SebastianStovall" target="_blank">
                            <img src={GitHubIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                    <div className="developer-linkedin">
                        <a
                            className="linkedin"
                            href="https://www.linkedin.com/in/sebastian-stovall-a17a8a211/"
                            target="_blank"
                        >
                            <img src={LinkedInIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="developer-container">
                <div className="developer-name">Jennifer Lee</div>
                <div className="developer-links-container">
                    <div className="developer-github">
                        <a className="github" href="https://github.com/CodeJellee" target="_blank">
                            <img src={GitHubIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                    <div className="developer-linkedin">
                        <a
                            className="linkedin"
                            href="https://www.linkedin.com/in/lee-pac-swe/"
                            target="_blank"
                        >
                            <img src={LinkedInIcon} alt="GitHub Icon" style={{ width: '18px', height: '18px' }} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
