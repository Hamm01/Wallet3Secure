import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer';
import CreateWallet from './components/CreateWallet';

function App() {

  return <>
    <main className='max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh] '>
      <Navbar />
      <CreateWallet />
    </main>
    <Footer />
  </>
}




export default App
