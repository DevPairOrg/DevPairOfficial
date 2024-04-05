from flask import Blueprint
from flask_login import login_required, current_user
from app.models import User, db, FriendRequest
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_
from .utils import error_response

friend_routes = Blueprint('friends', __name__)

@friend_routes.route('/request/<int:receiver_id>', methods=["POST"])
@login_required
def send_friend_request(receiver_id):
    """
    POST /api/friends/request/<int:receiver_id>

    Sends a friend request to another user.

    Requires login. 
    Creates a new friend request from the logged-in user to the user identified by the provided receiver_id.

    Args:
        receiver_id (int): The ID of the user to whom the friend request is to be sent.

    Request Body:
        None

    Returns:
        dict: A dictionary with either a success message or an error message and code.

    Raises:
        400: If the receiver_id is invalid.
        404: If the user with the provided receiver_id is not found.
        409: If a friend request already exists between the sender and receiver.
        500: If an unexpected error occurs during database operations.

    Examples:
        Successful Response:
        {
            <RequestId>: {
                ...receiver data...
            }
        }

        Error Response:
        {
            "error": {
                "code": 404,
                "message": "User not found"
            }
        }
    """
    # Validate receiver ID
    if not isinstance(receiver_id, int):
        return error_response("Invalid receiver ID", 400)

    # Validate and retrieve the receiver user
    receiver = User.query.get(receiver_id)
    if not receiver:
        return error_response("User not found", 404)
    
    # Check for existing friendship
    if current_user.is_friends(receiver):
        return error_response("You are already friends with this user", 409)
    
    # Check for existing friend request 
    existing_request = FriendRequest.query.filter(
        and_(FriendRequest.sender_id == current_user.id, FriendRequest.receiver_id == receiver_id) |
        and_(FriendRequest.sender_id == receiver_id, FriendRequest.receiver_id == current_user.id)
    ).first()

    if existing_request:
        return error_response("Friend request already exists", 409)
    
    try:
        # Create new friend request
        new_request = FriendRequest(sender=current_user, receiver=receiver)
        db.session.add(new_request)
        db.session.commit()

        return {new_request.id: new_request.receiver.to_dict(include_relationships=False)}, 201
    except Exception as e:
        db.session.rollback()
        return error_response("Failed to send friend request", 500)
   

@friend_routes.route('/request/<int:request_id>/accept', methods=["PUT"])
@login_required
def accept_friend_request(request_id):
    """
    PUT /api/friends/request/<int:request_id>/accept

    Accepts a pending friend request and establishes a friendship between the sender and receiver.

    Requires login. 
    Accepts a friend request identified by the provided request_id and establishes a friendship between the sender and receiver.

    Args:
        request_id (int): The ID of the friend request to be accepted.

    Request Body:
        None

    Returns:
        dict: A dictionary with either the current user's data or an error message and code.

    Raises:
        400: If the request_id is invalid or the user tried to accept a request they didn't receive.
        404: If the friend request with the provided request_id is not found.
        500: If an unexpected error occurs during database operations.

    Examples:
        Successful Response:
        {
            "requestId": <request_id>,
            "friend": {
                ...friend data...
            }
        }

        Error Response:
        {
            "error": {
                "code": 404,
                "message": "Friend request not found"
            }
        }
    """
    # Validate request ID
    if not isinstance(request_id, int):
        return error_response("Invalid request ID", 400)

    friend_request = FriendRequest.query.get(request_id)

    if not friend_request:
        return error_response("Friend request not found", 404)
    if friend_request.receiver != current_user:
        return error_response("You can only accept requests you have received.", 403)
    
    try:
        # Add users to each others friend lists
        friend_request.sender.friends.append(friend_request.receiver)
        friend_request.receiver.friends.append(friend_request.sender)

        db.session.delete(friend_request)
        db.session.commit()
        return {"requestId": request_id, "friend": friend_request.sender.to_dict(check_friend=True)}, 200
    except Exception as e:
        return error_response("Failed to establish friendship. Please try again later.", 500)

@friend_routes.route('/request/<int:request_id>', methods=['DELETE'])
@login_required
def cancel_sent_request(request_id):

    """
    DELETE /api/friends/request/<int:request_id>

    Cancels a sent friend request.

    Requires login. 
    Cancels a pending friend request sent by the logged-in user with the specified ID.

    Args:
        request_id (int): The ID of the friend request to cancel.

    Request Body:
        None

    Returns:
        dict: A dictionary with either the canceled request id or an error message.

    Raises:
        400: If the user tries to cancel a request they haven't sent or the request has already been accepted, rejected, or canceled.
        404: If the friend request with the provided ID is not found.
        500: If an unexpected error occurs during database operations.

    Examples:
        Successful Response:
        {
            "requestId": <request_id>
        }

        Error Response:
        {
            "error": {
                "code": 404,
                "message": "Friend request not found"
            }
        }
    """

    # Validate request ID
    if not isinstance(request_id, int):
        return error_response("Invalid request ID", 400)

    friend_request = FriendRequest.query.get(request_id)

    if not friend_request:
        return error_response("Friend request not found", 404)
    if friend_request.sender != current_user:
        return error_response("You can only cancel requests you have sent.", 403)
    
    try:
        db.session.delete(friend_request)
        db.session.commit()
        return {"requestId": request_id}, 200
    except Exception as e:
        return error_response("Failed to cancel request", 500)

@friend_routes.route('/request/<int:request_id>/reject', methods=['DELETE'])
@login_required
def reject_friend_request(request_id):

    """
    DELETE /api/friends/request/<int:request_id>/reject

    Rejects a received friend request.

    Requires login. 
    Rejects a pending friend request received by the logged-in user with the specified ID, removing it from both users' friend request lists.

    Args:
        request_id (int): The ID of the friend request to reject.

    Request Body:
        None

    Returns:
        dict: A dictionary with either the rejected request id or an error message and code.

    Raises:
        400: If the user tries to reject a request they haven't received or the request has already been accepted, rejected, or canceled.
        404: If the friend request with the provided ID is not found.
        500: If an unexpected error occurs during database operations.

    Examples:
        Successful Response:
        {
            "requestId": <request_id>
        }

        Error Response:
        {
            "error": {
                "code": 404,
                "message": "Friend request not found"
            }
        }
    """
    # Validate request ID
    if not isinstance(request_id, int):
        return error_response("Invalid request ID", 400)
    
    friend_request = FriendRequest.query.get(request_id)

    if not friend_request:
        return error_response("Friend request not found", 404)
    if friend_request.receiver != current_user:
        return error_response("You can only reject requests you have received.", 403)

    try:
        db.session.delete(friend_request)
        db.session.commit()
        return {"requestId": request_id}, 200
    except Exception as e:
        return error_response("Failed to reject request", 500)

@friend_routes.route('/<int:friend_id>', methods=['DELETE'])
@login_required
def unfriend(friend_id):
    """
    DELETE /api/friends/<int:friend_id>

    Unfriends another user.

    Requires login. 
    Removes the friendship between the logged-in user and the user with the specified ID. This action deletes both the friend association and any pending friend requests (sent or received) between the two users.

    Args:
        friend_id (int): The ID of the user to unfriend.

    Request Body:
        None

    Returns:
        dict: A dictionary with either the removed friend id or an error message and code.

    Raises:
        400: If the user tries to unfriend themself.
        404: If the user with the provided ID is not found.
        500: If an unexpected error occurs during database operations.

    Examples:
        Successful Response:
        {
            "friendId": "<friend_id>
        }

        Error Response:
        {
            "error": {
                "code": 404,
                "message": "User not found"
            }
        }
    """
    if not isinstance(friend_id, int):
        return error_response("Invalid friend ID", 400)
    
    if friend_id == current_user.id:
        return error_response("You cannot unfriend yourself", 400)

    friend = User.query.get(friend_id)
    if not friend:
        return error_response("User not found", 404)
    
    if not current_user.is_friends(friend):
        return error_response("You are not friends with this user", 409)
        
    try:
        # Delete friend association (remove from each other's friend lists)
        current_user.friends.remove(friend)
        friend.friends.remove(current_user)

        db.session.commit()
        return {"friendId": friend_id}, 200
    except Exception as e:
        return error_response("Failed to unfriend user", 500)