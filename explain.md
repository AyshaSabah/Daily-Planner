# Daily Planner - Code Explanation

This document explains how the Daily Planner application works, breaking down the project structure, the code logic, and the styling.

## 1. Project Structure

Here's what the key files and folders do:

- **`index.html`**: The main HTML file that the browser loads first. It links to the JavaScript entry point.
- **`src/`**: Contains all the frontend source code.
  - **`main.jsx`**: The "entry point" for React. It finds the `div` with `id="root"` in `index.html` and puts our React app inside it.
  - **`App.jsx`**: The main component where all the application logic lives.
  - **`App.css`**: The stylesheet that defines the "Cyber-Grid" look.
- **`backend/`**: (Optional) Contains the Python backend code.
  - **`main.py`**: A simple API server using FastAPI.
- **`package.json`**: Lists the project dependencies (like React) and scripts (like `npm run dev`).
- **`vite.config.js`**: Configuration for Vite, the tool that builds and runs our project.

---

## 2. The Frontend Logic (`src/App.jsx`)

This file uses **React**, a library for building user interfaces.

### State Management (`useState`)
We use `useState` to keep track of data that changes over time.

```jsx
const [tasks, setTasks] = useState(() => {
  // This function runs only once when the app starts.
  // It tries to load saved tasks from the browser's Local Storage.
  const saved = localStorage.getItem('daily-planner-tasks')
  if (saved) {
    return JSON.parse(saved)
  }
  // If no saved tasks, it returns a default list.
  return [...]
})
```

- **`tasks`**: An array of objects, where each object represents a task (id, title, time, completed).
- **`setTasks`**: A function we call whenever we want to update the list of tasks.

### Side Effects (`useEffect`)
`useEffect` lets us run code in response to changes.

**1. Saving to Local Storage:**
```jsx
useEffect(() => {
  // Whenever 'tasks' changes, save the new list to the browser.
  localStorage.setItem('daily-planner-tasks', JSON.stringify(tasks))
}, [tasks])
```

**2. Updating the Clock:**
```jsx
useEffect(() => {
  // Set up a timer to update 'currentTime' every minute (60000ms).
  const timer = setInterval(() => setCurrentTime(new Date()), 60000)
  
  // Cleanup function: stops the timer if the component is removed.
  return () => clearInterval(timer)
}, [])
```

### Adding a Task
```jsx
const addTask = (e) => {
  e.preventDefault() // Prevents the page from reloading when the form submits.
  
  // Create a new ID (highest existing ID + 1).
  const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
  
  const task = { ...newTask, id, completed: false }
  
  // Add the new task to the list and sort them by time.
  const updatedTasks = [...tasks, task].sort((a, b) => a.time.localeCompare(b.time))
  
  setTasks(updatedTasks)
  setNewTask({ title: '', time: '' }) // Clear the form.
}
```

### Rendering (The HTML part)
The `return (...)` block describes what the UI looks like. It uses **JSX**, which looks like HTML but lets us use JavaScript variables inside `{ curly braces }`.

- **`{tasks.map(task => ...)}`**: Loops through the `tasks` array and creates a `div` for each one.
- **`className={...}`**: We use dynamic strings to add classes like `active` or `completed` based on the task's state.

---

## 3. The Styling (`src/App.css`)

We used a **Clean Light / Neo-Brutalist** style. Here are the key techniques:

### CSS Variables
We define colors once at the top so we can change the theme easily.
```css
:root {
  --bg-main: #f8f9fa;
  --primary: #007bff; /* Vibrant Blue */
  /* ... */
}
```

### The Grid Background
We created the technical grid background using CSS gradients.
```css
background-image: 
  linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
background-size: 50px 50px; /* Creates 50px squares */
```

### Layout (CSS Grid)
We use CSS Grid to create the two-column layout.
```css
.main-content {
  display: grid;
  grid-template-columns: 400px 1fr; /* Sidebar is 400px, Content takes the rest */
  gap: 4rem;
}
```

### "Tech" Corners
We used pseudo-elements (`::before` and `::after`) to create the little L-shaped corners on the "Add Task" card.
```css
.card::before {
  content: '';
  position: absolute;
  top: -1px; left: -1px;
  width: 20px; height: 20px;
  border-top: 2px solid var(--primary);
  border-left: 2px solid var(--primary);
}
```

---

## 4. The Backend (Optional)

The `backend/main.py` file uses **FastAPI**, a Python framework.

- **`@app.get("/tasks")`**: Defines a "route". When you visit `/tasks`, it runs the function `get_tasks()` and returns the data as JSON.
- **`class Task(BaseModel)`**: Defines the "shape" of data we expect (id, title, time). This ensures data quality.

*Note: Currently, the React frontend is "standalone" and uses Local Storage. It doesn't talk to this Python backend yet, but the structure is there if you want to connect them later!*
