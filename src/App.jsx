import { useState } from 'react';
import FinanceApp from './pages/FinanceApp';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <FinanceApp setIsAuthenticated={setIsAuthenticated} />
  ) : (
    <Login setIsAuthenticated={setIsAuthenticated} />
  );
}

export default App;

// import FinanceApp from './pages/FinanceApp';

// function App() {
//   return <FinanceApp setIsAuthenticated={() => {}} />;
// }

// export default App;