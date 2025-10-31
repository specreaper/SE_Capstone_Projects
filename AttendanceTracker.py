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
if(user == session.query(Student).filter_by(studentID = user).first()):
    #Log student

session.close() #type: ignore
