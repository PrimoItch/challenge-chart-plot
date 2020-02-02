import React from 'react'
import {FlexibleXYPlot, HorizontalGridLines, XAxis, LineMarkSeriesCanvas, LabelSeries} from 'react-vis';

export default function EventChart() {
    
    const data = [
        {x: 0, y: 8},
        {x: 1, y: 5},
        {x: 2, y: 4},
        {x: 3, y: 9},
        {x: 4, y: 1},
        {x: 5, y: 76},
        {x: 6, y: 6},
        {x: 7, y: 3},
        {x: 8, y: 2},
        {x: 9, y: 0}
      ];
      
      return (      
          <FlexibleXYPlot >
            <HorizontalGridLines />
            <XAxis title="X Axis"  />
            <LineMarkSeriesCanvas data={data} />
          </FlexibleXYPlot>       
      );
}
