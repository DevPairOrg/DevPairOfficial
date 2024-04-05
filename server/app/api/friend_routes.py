from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import User, db, FriendRequest, FriendshipStatus
from .auth_routes import validation_errors_to_error_messages
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from .utils import error_response

friend_routes = Blueprint('friends', __name__)

@friend_routes.route('/request/<int:receiver_id>', methods=["POST"])
@login_required
def send_friend_request(receiver_id):
    """
    Sends a friend request to another user.

    This is a route handler for POST /api/friends/request/<int:receiver_id>. It requires login.
    It creates a new friend request from the logged-in user to the user identified by the provided receiver_id.

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
            "message": "Friend request sent successfully"
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
    
    try:
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
        
        # Create new friend request
        new_request = FriendRequest(sender=current_user, receiver=receiver)
        db.session.add(new_request)
        db.session.commit()

        return {new_request.id: new_request.receiver.to_dict(include_relationships=False)}, 201
    except IntegrityError as e:
        db.session.rollback()
        return error_response("Failed to send friend request", 500)
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)

@friend_routes.route('/request/<int:request_id>/accept', methods=["PUT"])
@login_required
def accept_friend_request(request_id):
    """
    @route PUT /request/<int:request_id>/accept

    @summary Accepts a pending friend request.

    @description Accepts a pending friend request with the specified ID, updating the request status to 
    Accepted and establishing a friendship between the sender and receiver.

    @param {int:request_id} ID of the friend request to accept.

    @returns {object} A dictionary containing the information of the newly added friend:
        - Friend {object}: A dictionary containing the friend's data.

    @throws:
        400 (Bad Request): 
            - If the user tries to accept a request they haven't received.
            - If the request has already been responded to (not pending).
        404 (Not Found): If the friend request with the provided ID is not found.
        500 (Internal Server Error): If an unexpected error occurs during database operations.

    Example Response:
    {
    "Friend": {
        ...friend data ...
    }
    }
    """
    # Validate request ID
    if not isinstance(request_id, int):
        return {"error": "Invalid request ID"}, 400


    friend_request = FriendRequest.query.get(request_id)

    if not friend_request:
        return {"error": "Friend request not found."}, 404
    if friend_request.receiver != current_user:
        return {"error": "You can only accept requests you have received."}, 400
    
    try:
        # Add users to each others friend lists
        friend_request.sender.friends.append(friend_request.receiver)
        friend_request.receiver.friends.append(friend_request.sender)

        db.session.delete(friend_request)
        db.session.commit()
        return current_user.to_dict(include_friend_requests=True), 200
    except IntegrityError as e:
        # undo any changes to db before the error
        db.session.rollback()
        return {"error": "Failed to establish friendship" + str(e)}, 500

@friend_routes.route('/request/<int:request_id>', methods=['DELETE'])
@login_required
def cancel_sent_request(request_id):

    """
    @route DELETE /request/<int:request_id>

    @summary Cancels a sent friend request.

    @description Cancels a pending friend request sent by the logged-in user with the specified ID.

    @param {int:request_id} ID of the friend request to cancel.

    @returns {object} A dictionary with a success message:
        - success (str): A message confirming successful request deletion.

    @throws:
        400 (Bad Request): 
            - If the user tries to cancel a request they haven't sent.
            - If the request has already been accepted, rejected, or canceled.
        404 (Not Found): If the friend request with the provided ID is not found.
        500 (Internal Server Error): If an unexpected error occurs during database operations.

    Example Response:
    {
    "success": "Request successfully deleted."
    }
    """

    # Validate request ID
    if not isinstance(request_id, int):
        return {"error": "Invalid request ID"}, 400

    try:
        friend_request = FriendRequest.query.get(request_id)

        if not friend_request:
            return {"error": "Friend request not found."}, 404
        if friend_request.sender != current_user:
            return {"error": "You can only cancel requests you have sent."}, 400
        
        db.session.delete(friend_request)
        db.session.commit()
        return current_user.to_dict(include_friend_requests=True), 200
    except IntegrityError as e:
        db.session.rollback()
        return {"error": "Failed to cancel request" + str(e)}, 500

@friend_routes.route('/request/<int:request_id>/reject', methods=['DELETE'])
@login_required
def reject_friend_request(request_id):

    """
    @route DELETE /request/<int:request_id>/reject

    @summary Rejects a received friend request.

    @description Rejects a pending friend request received by the logged-in user with the specified ID,
    removing it from both users' friend request lists.

    @param {int:request_id} ID of the friend request to reject.

    @returns {object} A dictionary with a success message:
        - success (str): A message confirming successful request rejection.

    @throws:
        400 (Bad Request): 
            - If the user tries to reject a request they haven't received.
            - If the request has already been accepted, rejected, or canceled.
        404 (Not Found): If the friend request with the provided ID is not found.
        500 (Internal Server Error): If an unexpected error occurs during database operations.

    Example Response:
    {
    "success": "Request successfully rejected."
    }
    """
    try:
        friend_request = FriendRequest.query.get(request_id)

        if not friend_request:
            return {"error": "Friend request not found."}, 404
        if friend_request.receiver != current_user:
            return {"error": "You can only reject requests sent to you."}, 400

        db.session.delete(friend_request)
        db.session.commit()
        return current_user.to_dict(include_friend_requests=True), 200
    except IntegrityError as e:
        db.session.rollback()
        return {"error": "Failed to reject request" + str(e)}, 500

@friend_routes.route('/<int:friend_id>', methods=['DELETE'])
@login_required
def unfriend(friend_id):
    """
    @route DELETE /<int:friend_id>

    @summary Unfriends another user.

    @description Removes the friendship between the logged-in user and the user with the specified ID.
    This action deletes both the friend association and any pending friend requests (sent or received)
    between the two users.

    @param {int:friend_id} ID of the user to unfriend.

    @returns {object} A dictionary with a success message:
        - success (str): A message confirming successful unfriending.

    @throws:
        400 (Bad Request): If the user tries to unfriend themself.
        404 (Not Found): If the user with the provided ID is not found.
        500 (Internal Server Error): If an unexpected error occurs during database operations.

    Example Response:
    {
    "success": "Successfully unfriended user."
    }
    """
    try:
        if friend_id == current_user.id:
            return {"error": "You cannot unfriend yourself."}, 400

        friend = User.query.get(friend_id)
        if not friend:
            return {"error": "User not found."}, 404
        
        # Delete friend association (remove from each other's friend lists)
        current_user.friends.remove(friend)
        friend.friends.remove(current_user)

        db.session.commit()
        return current_user.to_dict(include_friend_requests=True), 200
    except IntegrityError as e:
        db.session.rollback()
        return {"error": "Failed to remove friend" + str(e)}, 500