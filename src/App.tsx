import { useState } from 'react'
import './App.css'
import { generateMnemonic } from "bip39";
import Navbar from './components/Navbar'

function App() {
  const [mnemonic, setMnemonic] = useState("");
  console.log(mnemonic)
  return <div className='max-w-7xl mx-auto flex flex-col gap-4 p-4'>
    <Navbar />


  </div>
}




export default App
