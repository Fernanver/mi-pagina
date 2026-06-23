import './App.css'
import Sidebar from './componentes/sidebar.jsx'
import Content from './componentes/content.jsx'

function App() {
  return (
    <>
      <div id="crt-overlay"></div>
      <Sidebar />
      <Content />
    </>
  );
}

export default App;