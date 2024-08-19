import { ModeToggle } from '@/components/mode-toggle'
import { Button } from "@/components/ui/button"
import './App.css'



function App() {
  return <div className='w-full bg-red-50 flex justify-center items-center'>

    <ModeToggle />
    <Button>Clickme</Button>

  </div>
}




export default App
