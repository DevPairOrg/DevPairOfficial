from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

from sqlalchemy.schema import ForeignKey

class DirectMessage(db.Model):
    __tablename__ = "direct_messages"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod('direct_message_conversation_id')), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), nullable=False))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    conversation = db.relationship('DirectMessageConversation', back_populates='direct_messages')
    user = db.relationship('User', back_populates='direct_messages')

    def to_dict(self):
        return {
            'conversationId': self.conversation_id,
            'user': self.user.to_dict(),
            'message': self.message,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
