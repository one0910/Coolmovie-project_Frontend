import { useEffect, useReducer, useState } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { OrderContext, OrderInitialState, OrderReducer } from './store';
import { ThemeProvider } from 'styled-components';
import { Header, Footer } from './components';
import './assets/scss/all.scss';
import routes from './routes';
import { Provider } from 'react-redux';
import store from './store/store';
import { setIsMobileScreen } from './store/common/common.reducer';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useInitialization } from './includes/initialization';

function App() {
  // const reducer = useReducer(OrderReducer, OrderInitialState);
  const [state, dispatch] = useReducer(OrderReducer, OrderInitialState);
  const [theme, setTheme] = useState({ movieLevel: "", theaterSize: "" })
  const routing = useRoutes(routes);
  const location = useLocation();
  const path = ((location.pathname).startsWith('/admin')) ? 'admin' : location.pathname
  useInitialization()

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
