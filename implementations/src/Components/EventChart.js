import React from 'react'
import {FlexibleXYPlot, HorizontalGridLines, XAxis, LineMarkSeriesCanvas} from 'react-vis';

export default function EventChart(props) {

    return (  
        <FlexibleXYPlot height={props.height} xDomain={props.span} xType="time" >
          <HorizontalGridLines />
          <XAxis>Timestamp</XAxis>
          {props.dataToBePloted.map(props => (
            <LineMarkSeriesCanvas  {...props} />
          ))}
          
        </FlexibleXYPlot>   
      );    
  
}
