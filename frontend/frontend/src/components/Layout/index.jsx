import React from "react";

import Header from "../Header";
import TimeElapser from "../TimeElapser";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <TimeElapser />
      {children}
    </div>
  );
};

export default Layout;
