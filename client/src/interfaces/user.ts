import { FollowingObject, FollowingState } from './following';

export interface User {
    id: string;
    username: string;
    email: string;
    videoUid: string;
    screenUid: string;

    // Add other user fields here
    picUrl: string;
    about: string;
    github: string;
    linkedin: string;
    portfolio: string;
    leetcode: string;

    following: FollowingObject[];  //! No Longer Needed
    followers: FollowingObject[];  //! No Longer Needed

    friends: User[]
    sentRequests: {requestId: User} // User = user that the request is going to
    receivedRequests: {requestId: User} // User = user that sent YOU a request

    errors: string;
}

export interface TargetUserProps {
    targetUser: User;
    sessionUser: User | null;
    following: FollowingState;
    isFollowed: boolean;
    setIsFollowed?: React.Dispatch<React.SetStateAction<boolean>>;
    userId?: string;
    handleFollow?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>; // Define handleFollow property
}
