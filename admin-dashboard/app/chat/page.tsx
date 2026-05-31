'use client';

import { useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input) return;

    const updated = [...messages, { role: 'user', content: input }];
    setMessages(updated);
    setInput('');

    const res = await axios.post(`${API}/api/v1/ai/chat`, {
      userId: 'user-1',
      messages: updated,
    });

    setMessages([
      ...updated,
      { role: 'assistant', content: res.data.data.reply },
    ]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Chat</h1>

      {messages.map((m, i) => (
        <p key={i}>
          <b>{m.role}:</b> {m.content}
        </p>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ border: '1px solid #ccc', padding: 8 }}
      />

      <button onClick={send}>Send</button>
    </div>
  );
}
