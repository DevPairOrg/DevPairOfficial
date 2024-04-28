from flask import request
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, disconnect
from flask_login import current_user
import random, time, functools, datetime, logging

from app.models import FriendRequest

origins = []

# socketio = SocketIO(logger=True, engineio_logger=True, cors_allowed_origins=origins) # this is for error-handling, remove this so you dont get stacks of logs
socketio = SocketIO(cors_allowed_origins=origins)

socket_rooms = {}

logging.basicConfig(level=logging.ERROR)

# @socketio.on('connect') # must take this out in order to have authenticated_only as a decorator
def authenticated_only(f):
    """
        Defines authenticated only wrapper that will check if a user is authenticated before calling the original function. If not authenticated it will disconnect the user from the socket.
    """
    try:
        @functools.wraps(f)
        def wrapped(*args, **kwargs):
            if not current_user.is_authenticated:
                disconnect()
            else:
                return f(*args, **kwargs)
        return wrapped
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "authenticated_only"})


@socketio.on("join_room")
@authenticated_only
def handle_join_room():
    user = current_user
    rooms = list(socket_rooms.keys())

    try:
        eligible_rooms = [
            room
            for room in rooms
            if len(socket_rooms[room]["current_users"])  <= 1 and user.id not in socket_rooms[room]["user_history"]
        ]

        if eligible_rooms:
            chosen_room = random.choice(eligible_rooms)
        else:
            while True:
                new_room = f"room_{int(time.time())}_{user.id}"
                if new_room not in rooms:
                    chosen_room = new_room
                    break

        # Create the room in the dictionary if it doesn't exist
        socket_rooms.setdefault(chosen_room, {"current_users": [], "user_history": []})

        # Add the user to the chosen room
        socket_rooms[chosen_room]["current_users"].append(user.to_dict())
        socket_rooms[chosen_room]["user_history"].append(user.id)

        join_room(chosen_room)
        emit("joined", {"users": socket_rooms[chosen_room]["current_users"], "room": chosen_room}, room=chosen_room)

    except Exception as e:
        # Handle exceptions (e.g., room not found, socket connection issue)
        socketio.emit("join_room_error", {"error": str(e)}, to=user.id)
        socketio.emit('custom_error', {'error': str(e), 'route': "join_room"})


@socketio.on("leave_room")
@authenticated_only
def handle_leave_room(data):
    """
        If there is only one user in room, close room and delete from socket_rooms else leave room and update user_count in socket_rooms and let the room know a user left.

        Exxpected data:
        {
            "room": "example_room_name"
        }
    """
    try:
        if len(socket_rooms[data["room"]]["current_users"]) == 1:
            del socket_rooms[data["room"]]
            close_room(data["room"])
        else:
            leave_room(data["room"])
            socket_rooms[data["room"]]["current_users"] = [user for user in socket_rooms[data["room"]]["current_users"] if user["id"] != current_user.id]
            emit(
                "user_left", f"{current_user.username} has exited the room!", to=data["room"]
            )
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "leave_room"})


@socketio.on("temp_chat_message")
@authenticated_only
def handle_temp_chat(data):
    """
        Creates a response dictionary with the user who sent it, the current date and time, and the message and emits the message to the specified room.

        Expected data:
        {
            "message": "Example message content",
            "room": "example_room_name"
        }
    """
    try:
        response = {
            "from": current_user.to_dict(),
            "message": data["message"],
            "created_at": datetime.datetime.utcnow().strftime("%m/%d/%Y, %H:%M:%S"),
        }

        emit("temp_message_received", response, to=data["room"])
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "temp_chat_message"})

@socketio.on("removed_friend")
@authenticated_only
def handle_removed_friend(data):
    """
        Emits a message to the specified room that the friendship between users has been removed.

        Expected data:
        {
            "room": "example_room_name",
            "userId": "example_user_id"
        }
    """
    try:
        emit(
            "friend_removed", {"userId": data["userId"]}, to=data["room"], include_self=False
        )
    except Exception as e:
        emit('custom_error', {'error': str(e),  'route': "removed_friend"})

@socketio.on("accepted_request")
@authenticated_only
def handle_accepted_request(data):
    """
        Emits a message to the specified room that the friendship between users has been accepted.

        Expected data:
        {
            "room": "example_room_name",
            "userId": "example_user_id"
            "requestId": "example_request_id"
        }
    """
    try:
        emit(
            "friend_added", {"friend": current_user.to_dict(), "requestId": data["requestId"]}, to=data["room"], include_self=False
        )
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "accepted_request"})

@socketio.on("rejected_request")
@authenticated_only
def handle_rejected_request(data):
    """
        Emits a message to the specified room that the friendship between users has been rejected.

        Expected data:
        {
            "room": "example_room_name",
            "requestId": "example_request_id"
        }
    """
    try:
        emit(
            "friend_rejected", {"requestId": data["requestId"]}, to=data["room"], include_self=False
        )
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "rejected_request"})

@socketio.on("request_canceled")
@authenticated_only
def handle_request_cancelled(data):
    """
        Emits a message to the specified room that the friendship request has been cancelled.

        Expected data:
        {
            "room": "example_room_name",
            "requestId": "example_request_id"
        }
    """
    try:
        emit(
            "cancelled_request", {"requestId": data["requestId"]}, to=data["room"], include_self=False
        )
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "request_canceled"})

@socketio.on("sent_request")
@authenticated_only
def handle_sent_request(data):
    """
        Emits a message to the specified room that a friendship request has been sent.

        Expected data:
        {
            "room": "example_room_name",
            "requestId": "example_request_id"
        }
    """
    try:
        request = FriendRequest.query.get(data["requestId"])
        emit(
            "received_request", {"request": {request.id: request.sender.to_dict(include_relationships=False)}}, to=data["room"], include_self=False
        )
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "sent_request"})

@socketio.on('user_leaving')
@authenticated_only
def handle_user_leaving(data):
    try:
        response = {
            "user": data['userId'],
            "reason": 'Refreshed, Reloaded, or Closed Tab'
        }
        disconnect()
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "user_leaving"})



@socketio.on("send_users_to_gemini_dsa_component")
@authenticated_only
def handle_update_IDE(data):
    """
    sends both users to the gemini dsa problem IDE component

    Expected data:
        {
            "fetchData": "example_parsed_gemini_response_data",
            "room": "example_room_name"
        }

    """
    try:
        response = {
            "parsedGeminiResponse": data["fetchData"],
        }
        emit("send_users_to_gemini_dsa_component_received", response, to=data["room"])
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "send_users_to_gemini_dsa_component"})




@socketio.on("update_IDE")
@authenticated_only
def handle_update_IDE(data):
    """
    updates the IDE for both users

    Expected data:
        {
            "newValue": "example_ide_value",
            "room": "example_room_name"
        }

    """
    try:
        response = {
            "newValue": data["newValue"],
        }
        emit("update_IDE_received", response, to=data["room"])
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "update_IDE"})


@socketio.on("leave_gemini_page")
@authenticated_only
def handle_update_IDE(data):
    """
    exits gemini IDE page for both users

    Expected data:
        {
            "room": "example_room_name"
        }

    """
    try:
        emit("leave_gemini_page_received", to=data["room"])
    except Exception as e:
        emit('custom_error', {'error': str(e), 'route': "leave_gemini_page"})


@socketio.on('custom_error')
def epipe_error(e):
    logging.error(f"🤬🤬🤬🤬🤬🤬🤬SocketIO Error🤬🤬🤬🤬🤬🤬🤬: {e}")

@socketio.on_error()
def error_handler(e):
    logging.error(f"🤬🤬🤬🤬🤬🤬🤬SocketIO Error🤬🤬🤬🤬🤬🤬🤬: {e}")

@socketio.on("my error event")
def on_my_event(data):
    raise RuntimeError()

@socketio.on_error_default
def default_error_handler(e):
    print('🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶 on_error_default: ', e)
    print('Error in event:', request.event["message"])  # The event name, e.g., "join_room"
    print('With args:', request.event["args"])  # The event arguments
