import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BlogDetail from './pages/BlogDetail'
import CreatePost from './pages/CreatePost'
import Tags from './pages/Tags'
import TagDetail from './pages/TagDetail'
import { SupabaseProvider } from './contexts/SupabaseContext'

function App() {
  return (
    <SupabaseProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/tags/:tag" element={<TagDetail />} />
          </Routes>
        </main>
      </div>
    </SupabaseProvider>
  )
}

export default App