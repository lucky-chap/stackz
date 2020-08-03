import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import PrivateRoute from './components/routing/PrivateRoute';
// Redux
import { Provider } from "react-redux";
import Store from "./Store";
// ==
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

// Sent with every request to check if there is a token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => { 
  useEffect(() => {
    Store.dispatch(loadUser())
  }, [])

  return(
    <Provider store={Store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
)};

export default App;
