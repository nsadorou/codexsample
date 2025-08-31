'use client';

import { useEffect, useMemo, useState } from 'react';

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | in-progress | completed

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('todos-v1');
      if (raw) {
        const parsed = JSON.parse(raw).map(t =>
          t.status ? t : { ...t, status: t.completed ? 'completed' : 'active' }
        );
        setTodos(parsed);
      }
    } catch {}
  }, []);

  // Persist to localStorage when todos change
  useEffect(() => {
    try {
      localStorage.setItem('todos-v1', JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const remaining = useMemo(() => todos.filter(t => t.status !== 'completed').length, [todos]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => t.status !== 'completed');
      case 'in-progress':
        return todos.filter(t => t.status === 'in-progress');
      case 'completed':
        return todos.filter(t => t.status === 'completed');
      default:
        return todos;
    }
  }, [todos, filter]);

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(prev => [{ id: uid(), text: trimmed, status: 'active' }, ...prev]);
    setText('');
  }

  function setStatus(id, status) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  }

  function removeTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => t.status !== 'completed'));
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
            className={filter === 'in-progress' ? 'active' : ''}
            onClick={() => setFilter('in-progress')}
            aria-pressed={filter === 'in-progress'}
          >
            実行中
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
            aria-pressed={filter === 'completed'}
          >
            完了
          </button>
        </div>
        <button className="clearBtn" onClick={clearCompleted} disabled={todos.every(t => t.status !== 'completed')}>
          完了を削除
        </button>
      </div>

      <ul className="list">
        {filtered.map(todo => (
          <li key={todo.id} className="item">
            <label className="checkbox">
              <select
                value={todo.status}
                onChange={e => setStatus(todo.id, e.target.value)}
                aria-label="ステータス"
              >
                <option value="active">未着手</option>
                <option value="in-progress">実行中</option>
                <option value="completed">完了</option>
              </select>
              <span className={todo.status === 'completed' ? 'done' : ''}>{todo.text}</span>
            </label>
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

