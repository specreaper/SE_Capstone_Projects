import os
import time
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
databaseURL = 'sqlite:///studentsData.db'
Base = declarative_base()
engine = create_engine(databaseURL)

class Student(Base):
    __tablename__ = "students"
    StudentID = Column(Integer, primary_key=True)
    # Date = Column(DateTime, primary_key=True)
    Period = Column(String, primary_key=True)
    Name = Column(String)
    # Present = Column(Boolean)

# Set up SQLite database
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

users = Student(StudentID: 123, Period: "3A", Name: "Bob") #type: ignore
session.add(users)
users = Student(StudentID: 456, Period: "3A", Name: "Dob") #type: ignore
session.add(users)
users = Student(StudentID: 789, Period: "3A", Name: "Pob") #type: ignore
session.add(users)
session.commit()

user = str(input("what Student ID"))
if(user == session.query(Student).filter_by(studentID = user)):
    print("working")
    #Log student

session.close() #type: ignore
