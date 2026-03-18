import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/message")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Kargo Demo</h1>
      <p><strong>Message:</strong> {data.message}</p>
      <p><strong>Version:</strong> {data.version}</p>
      <p><strong>Status:</strong> {data.status}</p>
    </div>
  );
}
