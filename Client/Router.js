import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";

import DLInfo from "./components/pages/DLInfo";
import Results from "./components/pages/Results";
import Election from "./components/pages/Election";
import Home from "./components/pages/Home";
import Confirmation from "./components/pages/Confirmation";

const Router = (props) => {
  return (
    <Switch>
      <Route exact path={"/"}>
        <Home {...props} />
      </Route>
      <Route exact path="/elections">
        <Home {...props} />
      </Route>
      <Route path="/elections/:topicId">
        <Election {...props} />
      </Route>
      <Route>
      <Confirmation path="/confirmation"/>
      </Route>
      <Route path="/learn-more">
        <DLInfo />
      </Route>
      <Route path="/results">
        <Results />
      </Route>
    </Switch>
  );
};

export default Router;
