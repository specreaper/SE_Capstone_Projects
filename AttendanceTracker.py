import os
import time
import sqlite3
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship 
from datetime import datetime

# Set up the database using SQLAlchemy
databaseURL = 'sqlite:///studentsData.db'
Base = declarative_base()
engine = create_engine(databaseURL)
date = datetime.now().strftime("%x")

class Students(Base):
    __tablename__ = "Students"
    StudentID = Column(Integer, primary_key=True)
    Date = Column(String, primary_key=True)
    Period = Column(String, primary_key=True)
    Present = Column(Boolean)

# Set up SQLite database
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

session.query(Students).delete()
session.commit()

user = str(input("What Student ID: "))
period = str(input("What period: "))

log = Students(StudentID = user, Date = date, Period = period, Present = True)
session.add(log)
session.commit()

session.close()
