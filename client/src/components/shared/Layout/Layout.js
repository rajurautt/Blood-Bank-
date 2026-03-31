import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="header app-header">
        <Header />
      </div>
      <div className="row g-0 app-layout-row">
        <div className="col-md-3 col-lg-2">
          <Sidebar />
        </div>
        <div className="col-md-9 col-lg-10 app-content-area">{children}</div>
      </div>
    </>
  );
};

export default Layout;
