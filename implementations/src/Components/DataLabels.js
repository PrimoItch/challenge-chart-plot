import React from 'react'

import {DiscreteColorLegend} from 'react-vis';

export default function DataLabels(props) {

    return (<DiscreteColorLegend items={props.labels} height={props.height} />
        
    )
}
