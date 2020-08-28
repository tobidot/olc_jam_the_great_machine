import * as React from "react";
import ReactDOM, { render } from "react-dom";
import { Application } from "./components/Application";

import 'semantic-ui-css/semantic.min.css'

export function load_menu() {
    let app = document.getElementById('app');
    ReactDOM.render(<Application />, app);
}

