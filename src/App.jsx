import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('daily-planner-tasks')
    if (saved) {
      return JSON.parse(saved)
    }
    return [
      { id: 1, title: "Morning Meeting", time: "09:00", completed: false },
      { id: 2, title: "Code Review", time: "11:00", completed: false },
      { id: 3, title: "Lunch", time: "13:00", completed: false },
      { id: 4, title: "Project Work", time: "14:00", completed: false },
      { id: 5, title: "Wrap up", time: "17:00", completed: false },
    ]
  })

  const [newTask, setNewTask] = useState({ title: '', time: '' })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    localStorage.setItem('daily-planner-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.title || !newTask.time) return
    
    const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
    const task = { ...newTask, id, completed: false }
    
    // Sort tasks by time
    const updatedTasks = [...tasks, task].sort((a, b) => a.time.localeCompare(b.time))
    
    setTasks(updatedTasks)
    setNewTask({ title: '', time: '' })
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const getCurrentTask = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes()
    
    let currentTaskId = null
    
    tasks.forEach(task => {
      const [hours, minutes] = task.time.split(':').map(Number)
      const taskTime = hours * 60 + minutes
      const diff = now - taskTime
      
      // Highlight if within the hour starting at task time
      if (diff >= 0 && diff < 60) {
        currentTaskId = task.id
      }
    })
    return currentTaskId
  }

  const currentTaskId = getCurrentTask()

  return (
    <div className="app-container">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <nav className="navbar">
        <div className="logo">Daily Planner</div>
        <div className="current-time">
          {currentTime.toLocaleDateString()} <span className="time-separator">•</span> {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </nav>
      
      <main className="main-content">
        <aside className="sidebar">
          <div className="card form-card">
            <h2>Add New Task</h2>
            <form className="add-task-form" onSubmit={addTask}>
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  value={newTask.time} 
                  onChange={e => setNewTask({...newTask, time: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Task Description</label>
                <input 
                  type="text" 
                  placeholder="What needs to be done?" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <button type="submit">Add Task</button>
            </form>
          </div>
        </aside>

        <section className="tasks-section">
          <div className="section-header">
            <h2>Your Schedule</h2>
            <span className="task-count">{tasks.length} Tasks</span>
          </div>
          
          <div className="timeline">
            {tasks.length === 0 ? (
              <div className="empty-state">No tasks scheduled for today.</div>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-card ${task.id === currentTaskId ? 'active' : ''} ${task.completed ? 'completed' : ''}`}
                >
                  <div className="time">{task.time}</div>
                  <div className="details">
                    <h3>{task.title}</h3>
                  </div>
                  <div className="actions">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => {
                        setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))
                      }}
                      title="Mark as completed"
                    />
                    <button className="delete-btn" onClick={() => deleteTask(task.id)} title="Delete task">×</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
