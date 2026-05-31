'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API}/api/v1/admin/stats`).then((res) => {
      setData(res.data.data);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <h2>Users: {data.usersCount}</h2>
      <h2>Messages: {data.messagesCount}</h2>

      <h3>Recent Messages</h3>
      {data.recentMessages.map((m: any, i: number) => (
        <p key={i}>
          {m.role}: {m.content}
        </p>
      ))}
    </div>
  );
}
