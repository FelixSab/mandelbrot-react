import { setupTextMatrix } from 'js/webGPU';
import styles from './App.module.sass';

window.onload = setupTextMatrix;

export function App() {
  return <div className={styles.app}>Hello, World!</div>;
}
