import React  from '@upbeat/react/src';
import {addDecorator, configure} from '@storybook/react';
import {BrowserRouter} from "react-router-dom";

configure(require.context('../src', true, /\.stories\.tsx?$/), module);



const Router = storyFn => React.createElement(BrowserRouter, {}, storyFn());

addDecorator(Router);
