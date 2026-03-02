import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('tasks')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('loading tasks', e)
      return []
    }
  })
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed
  const [search, setSearch] = useState('')
  const [now, setNow] = useState(new Date())

  // persist tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    } catch (e) {
      console.error('saving tasks', e)
    }
  }, [tasks])

  // update current time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const addTask = () => {
    const text = newTask.trim()
    if (!text) return
    // prevent duplicates (case-insensitive)
    if (tasks.some((t) => t.text.toLowerCase() === text.toLowerCase())) {
      return
    }
    setTasks([
      ...tasks,
      { id: Date.now(), text, completed: false },
    ])
    setNewTask('')
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const toggleCompleted = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    )
  }

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app-container">
      <h1>Todo List</h1>
      <div className="date-time">
        {now.toLocaleString()}
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <div className="filter-group">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task.id)}
            />
            <span>{task.text}</span>
            <button className="delete" onClick={() => deleteTask(task.id)}>
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
