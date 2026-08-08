import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { menuMusic } from '@/services/audio/MenuMusic';
import { useGameStore } from '@/store/gameStore';
import './MainMenu.styles.css';

export function MainMenu() {
  const { musicVolume, muted } = useGameStore(
    useShallow((s) => ({
      musicVolume: s.settings.musicVolume,
      muted: s.settings.muted,
    })),
  );

  useEffect(() => {
    menuMusic.start(musicVolume, muted);
    return () => {
      // Keep playing while navigating to non-game screens; GameScreen stops it.
    };
  }, [musicVolume, muted]);

  useEffect(() => {
    menuMusic.setVolume(musicVolume);
  }, [musicVolume]);

  return (
    <div className="screen menu-screen">
      <h1 className="title">BATTLE CITY</h1>
      <p className="subtitle">React + TypeScript Edition</p>
      <nav className="menu-nav" aria-label="Main menu">
        <Link to="/game" className="menu-btn" onClick={() => menuMusic.stop()}>1 PLAYER</Link>
        <Link to="/game?mode=2p" className="menu-btn" onClick={() => menuMusic.stop()}>2 PLAYERS</Link>
        <Link to="/editor" className="menu-btn">CONSTRUCTION</Link>
        <Link to="/settings" className="menu-btn">OPTIONS</Link>
        <Link to="/scores" className="menu-btn">HIGH SCORES</Link>
      </nav>
      <p className="menu-audio-hint">
        Menu music: place your track at <code>public/audio/menu.mp3</code>
      </p>
    </div>
  );
}
