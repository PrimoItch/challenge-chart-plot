import PlotChartButton from './Components/PlotChartButton'
import EventChart from './Components/EventChart'
import DataLabels from './Components/DataLabels'
import AppHeader from './Components/AppHeader'
import DataInput from './Components/DataInput'
//import Grid from '@material-ui/core/Grid';
import { Button, Container } from 'react-bootstrap';
import JSON5 from 'json5'
import React, { Component } from 'react'
import labelSeries from 'react-vis/dist/plot/series/label-series'

import { Grommet, Box, Grid } from 'grommet';
import { grommet } from 'grommet/themes';

export default class AppMain extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            text: "",
            series: [],
            span: [],
            labels: []
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

    renderLabel(labels){
        return(
            <DataLabels labels={labels}></DataLabels>
        )
    }

    updateChart = ()=> {
        const dataText = this.state.text.split('\n')
        var events = [];

        for(var i = 0 ; i < dataText.length ; i++)
        {
            if(dataText[i] == '') { continue;}
        
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
        var seriesLabels = [];
        for(var property in series){
            seriesToPlot.push(series[property])
            seriesLabels.push(property)
        }

        this.setState({series: seriesToPlot, span: [beginTimestamp, endTimestamp], labels: seriesLabels});    
    }


    render() {
        return (
           /*
            <Grid container direction="column" justify="center" >
              <Grid container item xs={12}>     
                <AppHeader></AppHeader>
              </Grid>
      
              <Grid container>
                <Grid item xs={12}>     
                  {this.renderData(this.state.text)}
                </Grid> 
              </Grid>
      
              <Grid container alignItems="stretch">
                <Grid item xs={8}>     
                  {this.renderChart(this.state.series, this.state.span)}
                </Grid> 
                <Grid item xs={4}>     
                   {this.renderLabel(this.state.labels)}
                </Grid> 
              </Grid>
      
              <Grid container justify="flex-end">
                <Grid item xs={12}>     
                  <Button onClick={()=> this.updateChart()}>Plot Chart</Button>     
                 </Grid> 
              </Grid>      
             </Grid>
             */
            <Grommet full theme={grommet}>
                <Grid
                    rows={[ "xxsmall", "medium","medium", "xsmall" ]}
                    columns={['3/4' , '1/4']}
                    areas={[
                    ["header","header"],   
                    ["dataInput",'dataInput'],   
                    ["chart",'label'],   
                    ["footer",'footer'],                        
                    ]}
                    >

                <Box gridArea="header">
                    <AppHeader></AppHeader>
                </Box>
                <Box gridArea="dataInput">
                    {this.renderData(this.state.text)}
                </Box>
                <Box gridArea="chart">
                    {this.renderChart(this.state.series, this.state.span)}
                </Box>              
                <Box gridArea="label">
                     {this.renderLabel(this.state.labels)}
                </Box>       

                <Box gridArea="footer">
                    <Button onClick={()=> this.updateChart()}>Plot Chart</Button>   
                </Box>

            </Grid>
        </Grommet>            
        )
    }   
}

