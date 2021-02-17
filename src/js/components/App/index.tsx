import Logo from 'media/logo.png';
import styles from './App.module.sass';

const App = () => {
  return (
    <>
      <img src={Logo} height={100} />
      <div className={styles.title}>Hello, World!</div>
    </>
  );
};

export default App;
