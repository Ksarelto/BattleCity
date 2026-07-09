import { Link } from 'react-router-dom';

export function MainMenu() {
  return (
    <div className="screen menu-screen">
      <h1 className="title">BATTLE CITY</h1>
      <p className="subtitle">React + TypeScript Edition</p>
      <nav className="menu-nav">
        <Link to="/game" className="menu-btn">1 PLAYER</Link>
        <Link to="/game?mode=2p" className="menu-btn">2 PLAYERS</Link>
        <Link to="/editor" className="menu-btn">CONSTRUCTION</Link>
        <Link to="/settings" className="menu-btn">OPTIONS</Link>
        <Link to="/scores" className="menu-btn">HIGH SCORES</Link>
      </nav>
    </div>
  );
}
