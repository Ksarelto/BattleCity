import { Link } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';

export function HighScoresScreen() {
  const highScores = useGameStore((s) => s.highScores);

  return (
    <div className="screen menu-screen">
      <h1>HIGH SCORES</h1>
      <table className="scores-table">
        <thead>
          <tr>
            <th>#</th>
            <th>NAME</th>
            <th>SCORE</th>
            <th>STAGE</th>
          </tr>
        </thead>
        <tbody>
          {highScores.length === 0 ? (
            <tr><td colSpan={4}>No scores yet</td></tr>
          ) : (
            highScores.map((s, i) => (
              <tr key={s.date}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.score}</td>
                <td>{s.stage}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Link to="/" className="menu-btn">BACK</Link>
    </div>
  );
}
