'use client';

import { useEffect, useMemo, useState } from 'react';

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('todos-v1');
      if (raw) setTodos(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist to localStorage when todos change
  useEffect(() => {
    try {
      localStorage.setItem('todos-v1', JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const remaining = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(prev => [{ id: uid(), text: trimmed, note: '', completed: false }, ...prev]);
    setText('');
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function removeTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  function editNote(id) {
    const current = todos.find(t => t.id === id)?.note || '';
    const note = prompt('備考を入力', current);
    if (note !== null) {
      setTodos(prev => prev.map(t => (t.id === id ? { ...t, note } : t)));
    }
  }

  return (
    <main className="container">
      <h1 className="title">ToDo</h1>

      <form onSubmit={addTodo} className="addForm">
        <input
          className="input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="やることを入力して Enter"
          aria-label="新しいToDo"
        />
        <button className="addBtn" type="submit" disabled={!text.trim()}>
          追加
        </button>
      </form>

      <div className="toolbar">
        <span className="counter">未完了: {remaining}</span>
        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            すべて
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
            aria-pressed={filter === 'active'}
          >
            未完了
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
            aria-pressed={filter === 'completed'}
          >
            完了
          </button>
        </div>
        <button className="clearBtn" onClick={clearCompleted} disabled={todos.every(t => !t.completed)}>
          完了を削除
        </button>
      </div>

      <ul className="list">
        {filtered.map(todo => (
          <li key={todo.id} className="item">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="texts">
                <span className={todo.completed ? 'done' : ''}>{todo.text}</span>
                {todo.note && <span className="note">{todo.note}</span>}
              </span>
            </label>
            <button className="noteBtn" onClick={() => editNote(todo.id)} aria-label="備考">
              備考
            </button>
            <button className="delBtn" onClick={() => removeTodo(todo.id)} aria-label="削除">
              ×
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="empty">項目はありません</li>
        )}
      </ul>
    </main>
  );
}

