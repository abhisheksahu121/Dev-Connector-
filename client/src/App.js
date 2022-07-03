import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
// import Piechart from './Admin/Piechart';
//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    //the way by which we can dispatch the loaduser action from here is by taking the store directory and then we just call dispatch and pass in loaduser
    store.dispatch(loadUser());
  }, []); //second parameter pass as empty bcs doing this will make it so that it only run ones
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          {/* <h1>App</h1> */}
          {/* <Piechart/> */}
          {/* <Alert/> */}
          {/* <section> */}
          <Navbar />
          {/* <Landing/> */}
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              {/* <Route exact path="/login" element={<Login />} /> */}
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={Profiles}/>
              <Route exact path="/profile/:id" component={Profile} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute exact path="/add-experience" component={AddExperience} />
              <PrivateRoute exact path="/add-education" component={AddEducation} />
            </Switch>
          </section>
          {/* </section>   */}
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
