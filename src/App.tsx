import React, { useReducer, useState } from 'react';
import { Route, Routes, useLocation, useRoutes } from 'react-router-dom';
import { OrderContext, OrderInitialState, OrderReducer } from './store';
import { ThemeProvider } from 'styled-components';
import { Header, Footer } from './components';
import './assets/scss/all.scss';
import routes from './routes';
import { Provider } from 'react-redux';
import store from './store/store';


function App() {
  // const reducer = useReducer(OrderReducer, OrderInitialState);
  const [state, dispatch] = useReducer(OrderReducer, OrderInitialState);
  const routing = useRoutes(routes);
  const [theme, setTheme] = useState({ movieLevel: "", theaterSize: "" })
  const location = useLocation();

  const path = ((location.pathname).startsWith('/admin')) ? 'admin' : location.pathname

  return (
    <OrderContext.Provider value={[state, dispatch]}>
      <Provider store={store}>
        <ThemeProvider theme={{ ...theme, setTheme }}>
          <Header />
          {routing}
          {
            (path !== 'admin') ? <Footer /> : ''
          }
        </ThemeProvider>
      </Provider>
    </OrderContext.Provider>
  );
}

export default App;