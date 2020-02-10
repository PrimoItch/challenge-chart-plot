
import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils';
import AppHeader from '../Components/AppHeader'

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
})

afterEach( () => {
    document.body.removeChild(container);
    container = null;
})

it('can render and show correct label', ()=>{
   
    // test render 
    act(()=>{
        ReactDOM.render(<AppHeader></AppHeader>, container);
    })

    const header = container.querySelector('p');
    expect(header.textContent).toBe("Alan's Challenger")

});