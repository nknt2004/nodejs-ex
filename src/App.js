import React, { Component } from 'react';
import { Router, browserHistory, Route } from 'react-router';
import './App.css';
import Page from './component/Page';

const Home = (props) => {
 
  return (
    <Page title="Home">
    </Page>
  )
};

const About = (props) => (
  <Page title="About"/>
);

const Settings = (props) => (
  <Page title="Settings"/>
);

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/settings" component={Settings}/>
      </Router>
    );
  }
}

export default App;
