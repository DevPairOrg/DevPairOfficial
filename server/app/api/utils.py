from app.models import db

def error_response(message, status_code):
    db.session.rollback()
    return {"error": message}, status_code