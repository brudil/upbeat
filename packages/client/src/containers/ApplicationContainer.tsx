import React from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import {StatusBar} from "../components/StatusBar";
import {ProjectSidebar} from "../components/ProjectSidebar";
import {Global} from "@emotion/core";
import {Editor} from "../components/Editor";

export const ApplicationContainerComponent: React.FC = () => {
  return (
    <Router>
      <div>
        <Global styles={{
          body: {
          margin: 0,
          padding: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }
        }} />
        <div css={{
          display: 'flex',
        }}>
          <ProjectSidebar />
          <div css={{ flex: 'auto', marginLeft: '1rem' }}>
            <StatusBar />
            <Editor />
          </div>
        </div>
      </div>
    </Router>
  );
}
