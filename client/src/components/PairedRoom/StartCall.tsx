import PairEntryImg from '/src/assets/images/pair-entry.svg';
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
                        <img src={PairEntryImg} alt="loading-screen" />
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
