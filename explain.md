# Daily Planner - Code Explanation

This document explains how the Daily Planner app works today: what each file does, how the React logic behaves, how the UI is styled, and what the optional Python backend is for.

## Programming Language and Frameworks

The main frontend is written in **JavaScript** using **React** with **Vite** as the build tool. The React files use **JSX**, which lets you write UI markup inside JavaScript.

The optional backend is written in **Python** using **FastAPI**.

## 1. Project Structure

The main pieces are:

- `index.html`: The Vite entry page. It loads the app and includes the Google Fonts used by the design.
- `src/main.jsx`: The React bootstrap file. It mounts the app into the `#root` element.
- `src/App.jsx`: The main app component. It holds the planner state, task logic, and page layout.
- `src/App.css`: The app-specific styling, including the desktop layout and mobile responsive rules.
- `src/index.css`: Global resets and base page sizing.
- `backend/main.py`: An optional FastAPI backend with sample task routes.
- `package.json`: Project scripts and dependencies.

## 2. Frontend Overview

The frontend is a single React component that behaves like a small task planner.

It does four main things:

- loads saved tasks from Local Storage
- lets you add new tasks with a time and description
- lets you mark tasks complete or delete them
- highlights the task that matches the current time window

## 3. `src/App.jsx`

### Imports

The app imports `useState` and `useEffect` from React, plus the CSS file.

```jsx
import { useState, useEffect } from 'react'
import './App.css'
```

### Task State

`tasks` stores the full list of planner items. The initial value comes from Local Storage if it exists; otherwise the app starts with a default schedule.

```jsx
const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem('daily-planner-tasks')
  if (saved) {
    return JSON.parse(saved)
  }
  return [ ... ]
})
```

Each task has this shape:

- `id`: a unique number
- `title`: the task text
- `time`: a `HH:MM` string
- `completed`: a boolean flag

### Form State

`newTask` stores the temporary values from the add-task form.

```jsx
const [newTask, setNewTask] = useState({ title: '', time: '' })
```

### Clock State

`currentTime` stores the live time shown in the navbar.

```jsx
const [currentTime, setCurrentTime] = useState(new Date())
```

### Saving Tasks

Whenever `tasks` changes, the app writes the new list back to Local Storage so the schedule survives refreshes.

```jsx
useEffect(() => {
  localStorage.setItem('daily-planner-tasks', JSON.stringify(tasks))
}, [tasks])
```

### Updating the Clock

The clock updates every minute.

```jsx
useEffect(() => {
  const timer = setInterval(() => setCurrentTime(new Date()), 60000)
  return () => clearInterval(timer)
}, [])
```

### Adding a Task

`addTask` handles form submission.

What it does:

- stops the page from reloading
- checks that both fields are filled in
- creates a new `id`
- builds a new task object
- sorts the list by time
- saves the updated list
- clears the form

```jsx
const addTask = (e) => {
  e.preventDefault()
  if (!newTask.title || !newTask.time) return

  const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
  const task = { ...newTask, id, completed: false }
  const updatedTasks = [...tasks, task].sort((a, b) => a.time.localeCompare(b.time))

  setTasks(updatedTasks)
  setNewTask({ title: '', time: '' })
}
```

### Deleting a Task

`deleteTask` removes one task by filtering it out of the array.

```jsx
const deleteTask = (id) => {
  setTasks(tasks.filter(t => t.id !== id))
}
```

### Current Task Highlighting

`getCurrentTask` compares the current clock time against each task time.

It converts both values into minutes, then marks a task as current if the current time is within the hour starting at that task time.

That means a task scheduled for 09:00 is highlighted from 09:00 through 09:59.

```jsx
const getCurrentTask = () => {
  const now = currentTime.getHours() * 60 + currentTime.getMinutes()

  let currentTaskId = null

  tasks.forEach(task => {
    const [hours, minutes] = task.time.split(':').map(Number)
    const taskTime = hours * 60 + minutes
    const diff = now - taskTime

    if (diff >= 0 && diff < 60) {
      currentTaskId = task.id
    }
  })

  return currentTaskId
}
```

### Rendering the UI

The `return` block defines the page structure:

- a background with decorative blobs
- a navbar with the title and current date/time
- a sidebar card with the add-task form
- the schedule section with all tasks listed below

Each task card uses conditional classes:

- `active` when the task is in the current time window
- `completed` when the checkbox is checked

```jsx
className={`task-card ${task.id === currentTaskId ? 'active' : ''} ${task.completed ? 'completed' : ''}`}
```

The checkbox toggles the `completed` flag, and the delete button removes the task.

## 4. Styling in `src/App.css`

The visual style is clean, sharp, and slightly neo-brutalist.

### Design Tokens

The top of the file defines CSS variables for the main colors and fonts.

These variables make the design easy to adjust without rewriting every rule.

### Page Background

The page uses a light grid background and floating blurred blobs for visual texture.

- the grid comes from layered CSS gradients
- the blobs are fixed-position circles with blur and animation

### Layout

The main desktop layout is a two-column CSS Grid:

- left side: the form card
- right side: the schedule

On smaller screens, the layout collapses into a single column.

### Cards and Buttons

The cards use borders, sharp corners, and accent corner marks created with pseudo-elements.

The button and task controls keep the same strong visual language with clear hover and active states.

### Mobile Responsiveness

The file includes breakpoint rules for tablet and phone widths.

On mobile, the app:

- reduces outer spacing
- stacks the navbar into a vertical layout
- shrinks headings and labels
- makes task rows more compact
- keeps the time, title, and actions aligned in a tighter grid

## 5. Global Styles in `src/index.css`

This file provides the base page reset.

Important parts:

- `body` removes the default margin and sets a minimum width/height
- `#root` is set to full width so React can fill the page
- default browser typography and button styles are normalized

## 6. Optional Backend in `backend/main.py`

The backend is a small FastAPI example.

It defines a `Task` model with Pydantic:

- `id`: integer
- `title`: task name
- `time`: string in `HH:MM` format
- `completed`: optional boolean, defaulting to `False`

It also includes simple routes:

- `GET /` returns a basic status message
- `GET /tasks` returns the mock task list
- `POST /tasks` appends a task to the in-memory list

Right now the React app does not call this backend. The frontend works on its own with Local Storage, so the backend is more of a starter structure if you want to connect the app to an API later.

## 7. Data Flow Summary

The app flow is simple:

1. React loads.
2. Saved tasks are read from Local Storage or default tasks are used.
3. The clock updates every minute.
4. Adding, completing, or deleting a task updates state.
5. State changes are written back to Local Storage.
6. The UI rerenders automatically with the new schedule.

That is the full behavior of the current Daily Planner app.
