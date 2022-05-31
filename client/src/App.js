import Canvas from './components/Canvas';
import SettingBar from './components/SettingBar';
import Toolbar from './components/Toolbar';
import './styles/app.scss'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route 
                        path="/:id"
                        element={
                            <>
                                <Toolbar/>
                                <SettingBar/>
                                <Canvas/>
                            </>
                        }
                    />
                    <Route path="*" element={<Navigate replace to={`f${(+new Date).toString(16)}`} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;