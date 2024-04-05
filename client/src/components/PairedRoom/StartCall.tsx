import CatImage from '/src/assets/images/devpair-loading-screen.png';
import Footer from '../Footer/Footer';

interface StartCallProps {
    handleJoinClick: () => void;
    loading: boolean;
}

const StartCall: React.FC<StartCallProps> = ({ handleJoinClick, loading }) => {
    return (
        <>
            <main id="video-main-wrapper">
                <div className="not-joined-wrapper">
                    <h1>Get Started with Video Calling</h1>
                    <div id="join-call-cat-image">
                        <img src={CatImage} alt="loading-screen" />
                    </div>
                    <div id="join-channel-button-container">
                        <button onClick={handleJoinClick} disabled={loading} className="join-channel-button">
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <p className="join-channel-button-text">Pair Up!</p>
                            )}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default StartCall;
