from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI()

class Task(BaseModel):
    id: int
    title: str
    time: str # HH:MM format
    completed: bool = False

# Mock data
tasks = [
    {"id": 1, "title": "Morning Meeting", "time": "09:00", "completed": False},
    {"id": 2, "title": "Code Review", "time": "11:00", "completed": False},
    {"id": 3, "title": "Lunch", "time": "13:00", "completed": False},
]

@app.get("/")
def read_root():
    return {"message": "Daily Planner API"}

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks

@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    tasks.append(task.dict())
    return task
