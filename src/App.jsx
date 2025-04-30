import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Provider } from "react-redux";
import 'antd/dist/antd.css'; // Make sure this line is here to import Ant Design styles
import store from "./features/store";

function App() {

  console.log("In Admin Layout")

 
  return (
    <BrowserRouter>
      <Provider store={store}>
    <AppRoutes/>
    </Provider>
  </BrowserRouter>
  )
}

export default App
