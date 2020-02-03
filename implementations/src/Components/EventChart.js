import React from 'react'
import {FlexibleXYPlot, HorizontalGridLines, XAxis, LineMarkSeriesCanvas, LabelSeries} from 'react-vis';

export default function EventChart(props) {
      
   /*

    var dataToBePloted = [
        {          
          key: 'qwe',
          data: [{x:0, y:0},{x:1, y:2}]
        },
        {      
          key: 1,   
          data: [{x:0, y:2},{x:1, y:0}]
        }
    ];   
    
    var data = []
    for (let i = 0; i < 20; i++) {
      const series = [];
      for (let j = 0; j < 100; j++) {
        series.push({x: j, y: (i / 10 + 1) * Math.sin((Math.PI * (i + j)) / 50)});
      }
      data.push({color: i, key: i, data: series, opacity: 0.8});
    }
     */

     var asdasd = props.dataToBePloted;
     var ddddd = props.span;
      
      return (      
          <FlexibleXYPlot xDomain={props.span} >
            <HorizontalGridLines />
            {props.dataToBePloted.map(props => (
              <LineMarkSeriesCanvas {...props} />
            ))}
            
          </FlexibleXYPlot>       
      );
}
