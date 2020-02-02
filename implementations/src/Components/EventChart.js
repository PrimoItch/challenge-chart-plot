import React from 'react'
import {FlexibleXYPlot, HorizontalGridLines, XAxis, LineMarkSeriesCanvas, LabelSeries} from 'react-vis';

export default function EventChart() {
    
  
    var mydata = [
        {          
          key: 0,
          data: [{x:0, y:0},{x:1, y:2}]
        },
        {      
          key: 1,   
          data: [{x:0, y:2},{x:1, y:0}]
        }
    ];

    /*
    var data = []
    for (let i = 0; i < 20; i++) {
      const series = [];
      for (let j = 0; j < 100; j++) {
        series.push({x: j, y: (i / 10 + 1) * Math.sin((Math.PI * (i + j)) / 50)});
      }
      data.push({color: i, key: i, data: series, opacity: 0.8});
    }
     */
      
      return (      
          <FlexibleXYPlot >
            <HorizontalGridLines />
            <XAxis title="X Axis"  />
            {mydata.map(props => (
              <LineMarkSeriesCanvas {...props} />
            ))}
            
          </FlexibleXYPlot>       
      );
}
