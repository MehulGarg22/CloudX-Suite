import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import MyRoutes from './components/routes/routes'

function App() {
  return (
    <BrowserRouter>
      <MyRoutes/>
    </BrowserRouter>
  );
}

export default App;
