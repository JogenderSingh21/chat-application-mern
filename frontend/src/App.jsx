import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ChatProvider from "./Context/chatProvider";

function App() {
  return (
    <BrowserRouter>
        <div className="h-[100vh] flex bg-my-bg bg-cover bg-center">
          <ChatProvider>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chats" element={<ChatPage />} />
          </Routes>
          </ChatProvider>
        </div>
      </BrowserRouter>
  );
}

export default App;
