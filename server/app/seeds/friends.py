# Import necessary modules
from app.models import db, User, FriendRequest, environment, SCHEMA, FriendshipStatus
from sqlalchemy.sql import text

def seed_friend_requests():
    # Find Demo user to seed friend requests and friends
    demo = User.query.filter_by(email='demo@aa.io').first()

    # Define friend requests (sender_id, receiver_id)
    friend_requests = [
        {'sender_id': demo.id, 'receiver_id': 2, 'status': FriendshipStatus.PENDING},
        {'sender_id': demo.id, 'receiver_id': 3, 'status': FriendshipStatus.PENDING},  
        {'sender_id': 4, 'receiver_id': demo.id, 'status': FriendshipStatus.PENDING},
    ]

    # Iterate over requests and create FriendRequest objects
    for request in friend_requests:
        new_request = FriendRequest(**request)
        db.session.add(new_request)

    # Commit the changes to the database
    db.session.commit()

def undo_friend_requests():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friend_requests RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friend_requests"))

    db.session.commit()

def seed_friends_associations():
    # Find Demo user to seed friend requests and friends
    demo = User.query.filter_by(email='demo@aa.io').first()

    # Create a friendship between user 1 and 5 (both directions)
    user1 = User.query.get(1)
    user5 = User.query.get(5)

    user1.friends.append(user5)  # Add user5 to user1's friend list
    user5.friends.append(user1)  # Add user1 to user5's friend list
    demo.friends.append(user1)
    demo.friends.append(user5)
    user1.friends.append(demo)
    user5.friends.append(demo) 


    db.session.commit()  # Commit the changes to the database

def undo_friends_associations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends_association RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends_association"))

    db.session.commit()
