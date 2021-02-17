import { render } from 'react-dom';
import App from './js/components/App';
import './styles/global.sass';

render(<App />, document.getElementById('app') as Element);
