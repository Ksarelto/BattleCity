import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { EditorScreen } from '@/pages/EditorScreen';
import { GameScreen } from '@/pages/GameScreen';
import { HighScoresScreen } from '@/pages/HighScoresScreen';
import { MainMenu } from '@/pages/MainMenu';
import { SettingsScreen } from '@/pages/SettingsScreen';

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
