import { FollowingState } from './following';

type UserWithoutFriends = Omit<User, 'friends'>;

export interface Request {
    [requestId: number]: UserWithoutFriends
}

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

    friends: User[];
    sentRequests: Request; // User = user that the request is going to
    receivedRequests: Request; // User = user that sent YOU a request
    totalPending: number;

    isFriend?: boolean;
    awaitingRequest?: boolean; // If the user is awaiting a response to sent request
    pendingRequest?: boolean;

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
