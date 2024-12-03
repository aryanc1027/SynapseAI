from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.study_set import StudySet
from app.models.user import User
from app.models.study_history import StudyHistory

def insert_fake_study_sets(user_id: int, num_sets: int = 5):
    db: Session = SessionLocal()
    try:
        for i in range(num_sets):
            study_set = StudySet(
                title=f"Study Set {i + 1}",
                description=f"This is a description for study set {i + 1}.",
                user_id=user_id
            )
            db.add(study_set)
        db.commit()
        print(f"Inserted {num_sets} study sets for user {user_id}.")
    except Exception as e:
        print(f"Error inserting data: {e}")
        db.rollback()
    finally:
        db.close()

insert_fake_study_sets(user_id=1)