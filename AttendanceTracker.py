import sqlite3
from sqlalchemy import ( #type: ignore
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship #type: ignore

# Set up the database using SQLAlchemy
Base = declarative_base()
engine = create_engine("sqlite:///students.db")

class Student(Base):
    __tablename__ = "students"
    name = Column(String)
    studentID = Column(String, primary_key=True)

# Set up SQLite database
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

users = Student(name: "bob", studentID: "1") #type: ignore
session.add(users)
users = Student(name: "dob", studentID: "2") #type: ignore
session.add(users)
users = Student(name: "pob", studentID: "3") #type: ignore
session.add(users)
session.commit()

user = str(input("what school username"))
