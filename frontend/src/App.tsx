import { Provider } from 'react-redux';
import { store } from './store';
import { CandidateList } from './components/CandidateList';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background">
        <CandidateList />
        <Toaster />
      </div>
    </Provider>
  );
}

export default App;
