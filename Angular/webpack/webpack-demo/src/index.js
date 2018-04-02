import _ from 'lodash';
import './style.css';
import jpg_img from './img/29.jpg';

import printMe from './print.js';

function component() {
    let element = document.createElement('div');
    let btn = document.createElement('button');

    // Lodash
    element.innerHTML = _.join(['Hello', 'world'], ' ');
    element.classList.add("hello");

    // manage output
    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;
    element.appendChild(btn);

    // bundle img folder
    let img = new Image();
    img.src = jpg_img;
    element.appendChild(img);

    return element;
}

document.body.appendChild(component());