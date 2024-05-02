import SocialLinksButtons from './SocialLinksButtons';
import './ExternalUserProfile.css';
import { User } from '../../interfaces/user';

const ExternalUserProfile: React.FC<User> = (externalUser) => {
    return (
        <>
            <main className="external-profile-main">
                <div className="external-profile-container">
                    <h1>External User Profile</h1>
                    <div>
                        <button>[Arrowleft] Go Back</button>
                        <div className="section-profile-header">
                            <img src="#" alt="profile-picture"></img>
                            <div>
                                <div>Friend Name</div>
                                <div>Joined Date</div>
                                <div>
                                    <div># of Friends</div>
                                    <div># of Problems Solved</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button>Follow</button>
                </div>
                <h1>About Me:</h1>
                <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque voluptatem placeat delectus
                    ipsa saepe voluptas molestias sapiente distinctio tenetur fuga? Impedit praesentium officiis
                    excepturi. Rerum iure earum dolor aliquam nemo?
                </div>
                <SocialLinksButtons {...externalUser} />
            </main>
        </>
    );
};

export default ExternalUserProfile;
