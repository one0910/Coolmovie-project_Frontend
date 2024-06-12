import React, { useReducer, useState } from 'react';
import { Route, Routes, useRoutes } from 'react-router-dom';
import { OrderContext, OrderInitialState, OrderReducer } from './store';
import { ThemeProvider } from 'styled-components';
import { Header, Footer } from './components';

import './assets/scss/all.scss';
import routes from './routes';



function App() {
  // const reducer = useReducer(OrderReducer, OrderInitialState);
  const [state, dispatch] = useReducer(OrderReducer, OrderInitialState);
  const routing = useRoutes(routes);
  const [theme, setTheme] = useState({ movieLevel: "", theaterSize: "" })
  return (
    <OrderContext.Provider value={[state, dispatch]}>
      <ThemeProvider theme={{ ...theme, setTheme }}>
        <Header />
        {routing}
        <Footer />
      </ThemeProvider>
    </OrderContext.Provider>
  );
}

export default App;
