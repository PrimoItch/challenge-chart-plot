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
            data: []
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
        var chartData = []
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
                var series = [];
                var seriesName = '';    
                for(var i=0 ; i < eventGroups.length ; i++){                   
                    seriesName += eventGroups[i] + "_"
                }

                for(var i=0 ; i < eventSelections.length ; i++)
                {
                    var seriesKeyName = seriesName+eventSelections[i].property;
                    if(seriesKeyName in series){
                        series[seriesKeyName].push( eventSelections[i].value );
                    }else{
                        series[seriesKeyName] = [eventSelections[i].value];  
                    }
                }
            }
        }      

    }

    buildChart = (events) => {
        var startEventHasCalled = false;
        var groups = []
        var selects = []
        for(var i = 0 ; i < events.length ; i++)
        {
            var event = events[i];            
            if(event.type == 'start')
            {
                groups.push(event.groups)
                selects.push(event.selects)                
            }
        }      
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
                  <EventChart></EventChart>
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

