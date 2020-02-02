import React from 'react'

import {DiscreteColorLegend} from 'react-vis';

export default function DataLabels() {
    const ITEMS = [
        'Options',
        'Buttons',
        'Select boxes',
        'Date inputs',
        'Password inputs',
        'Forms',
        'Other'
      ];
    return (
       
            <DiscreteColorLegend items={ITEMS} />
        
    )
}
