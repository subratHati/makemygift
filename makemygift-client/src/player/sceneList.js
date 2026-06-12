import WindowKnockScene from './scenes/WindowKnockScene.jsx';
import Section2Scene from './scenes/Section2Scene.jsx';
import Task1Scene from './scenes/Task1Scene.jsx';
import Task2Scene from './scenes/Task2Scene.jsx';
import Task3Scene from './scenes/Task3Scene.jsx';
import FinaleScene from './scenes/FinaleScene.jsx';

// The full experience, in order. Each scene calls onNext() when done; the
// finale is the ending and stays on the reveal.
export const sceneList = [
  { id: 'window-knock', component: WindowKnockScene },
  { id: 'welcome-gate', component: Section2Scene },
  { id: 'task-1-love', component: Task1Scene },
  { id: 'task-2-puzzle', component: Task2Scene },
  { id: 'task-3-say-it', component: Task3Scene },
  { id: 'finale', component: FinaleScene },
];
