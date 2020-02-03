import PlotChartButton from './Components/PlotChartButton'
import EventChart from './Components/EventChart'
import DataLabels from './Components/DataLabels'
import AppHeader from './Components/AppHeader'
import DataInput from './Components/DataInput'
import Grid from '@material-ui/core/Grid';
import { Button } from 'react-bootstrap';
import JSON5 from 'json5'
import React, { Component } from 'react'

export default class AppMain extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            text: "",
            series: [],
            span: [],
        }

    }  

    renderData(){
        return (
            <DataInput                    
                onChange={
                    (newText)=>{
                            this.setState({text: newText })
                        }} 
            ></DataInput>
        )
    }

    renderChart(data, span){
        return(
            <EventChart span = {span} dataToBePloted = {data}>
            </EventChart>
        )
    }

    /*
    updateChart2 = () => {
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
        var span = [0,1]

        this.setState({series:dataToBePloted, span: span })
    }
    */
    updateChart = ()=> {
        const dataText = this.state.text.split('\n')
        var events = [];

        for(var i = 0 ; i < dataText.length ; i++)
        {
            events.push( JSON5.parse(dataText[i]))
        }      
        
        var startEventHasCalled = false;
         var timeSpanSetted = false;
        var groups = []
        var selects = []
        var beginTimestamp;
        var endTimestamp;    
        var stopReached=false;    
        var chartData = []
        var series = [];
        for(var i = 0 ; i < events.length ; i++)
        {
            var event = events[i];
            if(event.type === 'start')
            {
                groups = event.group
                selects = event.select
                startEventHasCalled = true;
            }           

            if(event.type === 'span')
            {
                beginTimestamp = event.begin;
                endTimestamp = event.end;
                timeSpanSetted = true;
            }

            if(event.type === 'data')
            {
                var eventGroups = [];
                var eventSelections = [];
                for(var property in event)
                {                    
                    var propertyValue = event[property] 
                    
                    if(groups.indexOf(property) >= 0 )
                    {
                        eventGroups.push(propertyValue);
                    }
                    if(selects.indexOf(property) >= 0 )
                    {
                        eventSelections.push({'property': property, 'value': propertyValue});
                    }
                }
                
                eventGroups.sort();
                eventSelections.sort();                
                var seriesName = '';    
                for(var groupIndex=0 ; groupIndex < eventGroups.length ; groupIndex++){                   
                    seriesName += eventGroups[groupIndex] + "_"
                }

                for(var selectionIndex=0 ; selectionIndex < eventSelections.length ; selectionIndex++)
                {
                    var seriesKeyName = seriesName+eventSelections[selectionIndex].property;
                    if(seriesKeyName in series){
                        series[seriesKeyName]['data'].push( {'x': event.timestamp, 'y': eventSelections[selectionIndex].value} );
                    }else{
                        series[seriesKeyName] = {'key': seriesKeyName ,'data': [{'x':event.timestamp, 'y': eventSelections[selectionIndex].value} ]}  
                        //series.push( [{'key': seriesKeyName ,'data': [{'x':event.timestamp, 'y': eventSelections[selectionIndex].value} ]} ] );
                    }
                }
            }

            if(event.type === 'stop'){
                // Don't know very well what to do
                stopReached = true;
            }            
        }     

        var seriesToPlot = []
        for(var property in series){
            seriesToPlot.push(series[property])
        }

        this.setState({series: seriesToPlot, span: [beginTimestamp, endTimestamp]});    
    }


    render() {
        return (
            <div spacing={2}>       
            <Grid container direction="column" justify="center" >
              <Grid container item xs={12}>     
                <AppHeader></AppHeader>
              </Grid>
      
              <Grid container>
                <Grid item xs={12}>     
                  {this.renderData(this.state.text)}
                </Grid> 
              </Grid>
      
              <Grid container>
                <Grid item xs={8}>     
                  {this.renderChart(this.state.series, this.state.span)}
                </Grid> 
                <Grid item xs={4}>     
                  <DataLabels></DataLabels>
                </Grid> 
              </Grid>
      
              <Grid container>
                <Grid item xs={12}>     
                  <Button onClick={()=> this.updateChart()}>Plot Chart</Button>     
                 </Grid> 
              </Grid>      
             </Grid>
      
          </div>
        )
    }   
}

