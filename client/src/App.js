import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
// import Piechart from './Admin/Piechart';
//Redux
import {Provider} from 'react-redux';
import store from './store';

import './App.css';

const  App = () =>(
   <Provider store = {store}>
<Router>
<Fragment>
{/* <h1>App</h1> */}
   {/* <Piechart/> */}
   <Navbar/>
   <section>
   <Routes>
   <Route exact path='/' element={<Landing/>} />
   {/* <section className='container'> */}
      <Route exact path='/register' element={<Register/>} />
      <Route exact path='/login' element={<Login/>} />
      {/* </section> */}
   </Routes>
   </section>  
</Fragment>
</Router>
</Provider>
);

export default App;
