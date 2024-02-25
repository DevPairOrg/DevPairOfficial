from .db import db, environment, SCHEMA, add_prefix_for_prod

from sqlalchemy.schema import ForeignKey

class DirectMessage(db.Model):
    __tablename__ = "direct_messages"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, ForeignKey(add_prefix_for_prod('direct_message_conversation_id')), nullable=False)

    def to_dict(self):
        data = {
            'id': self.id,
            'message_text': self.message_text,
            'created_at': self.created_at
        }

        return data
