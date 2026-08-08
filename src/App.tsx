import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { EditorScreen } from '@/app/EditorScreen';
import { GameScreen } from '@/app/GameScreen';
import { HighScoresScreen } from '@/app/HighScoresScreen';
import { MainMenu } from '@/app/MainMenu';
import { SettingsScreen } from '@/app/SettingsScreen';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/editor" element={<EditorScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/scores" element={<HighScoresScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
