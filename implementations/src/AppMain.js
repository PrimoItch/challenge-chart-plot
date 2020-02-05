import EventChart from './Components/EventChart'
import DataLabels from './Components/DataLabels'
import AppHeader from './Components/AppHeader'
import DataInput from './Components/DataInput'

import JSON5 from 'json5'
import React, { Component } from 'react'
import labelSeries from 'react-vis/dist/plot/series/label-series'

//import { makeStyles } from '@material-ui/core/styles';
//import Paper from '@material-ui/core/Paper';
//import Grid from '@material-ui/core/Grid';

//import GridLayout from 'react-grid-layout';
//import '../node_modules/react-grid-layout/css/styles.css';
//import '../node_modules/react-resizable/css/styles.css';

import { LabelSeries } from 'react-vis/dist';

export default class AppMain extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            text: '',
            series: [],
            span: [],
            labels: [],
            chartHeight: '0px'
        }

    }  

    renderData(){
        return (
            <DataInput  className='dataImput'                       
                onChange={
                    (newText)=>{
                            this.setState({text: newText })
                        }} 
            ></DataInput>
        )
    }

    renderChart(data, span, height){
        return(
            <EventChart span = {span} dataToBePloted = {data} height={height}>
            </EventChart>
        )
    }

    renderLabel(labels, height){
        return(
            <DataLabels labels={labels} height={height}></DataLabels>
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
                    }
                }
            }

            if(event.type === 'stop'){
                // All data after stop event should be ignored
                break;
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

    componentDidMount(){
        this.updateChartHeight();
        
        window.addEventListener("resize", this.updateChartHeight.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateChartHeight.bind(this));
      }

    updateChartHeight(){
        var mainContainer = document.getElementById('mainContainer')

        var header = document.getElementById('headerDiv');
        var data = document.getElementById('dataDiv');
        var footer =  document.getElementById('footerDiv');
        var chart = document.getElementById('chartDiv');

        var mainContainerHeight = mainContainer.clientHeight;
        var dataHeight = data.clientHeight;
        var footerHeight = footer.clientHeight;
        var headerHeight = header.clientHeight;

        var chartHeight = mainContainerHeight - dataHeight - footerHeight - headerHeight;

        this.setState({chartHeight: chartHeight})

    }

    


    render() {    
        
        const layout = [
            {i: 'dataImput', x: 0, y: 0, w: 1, h: 1},
            {i: 'chart', x: 0, y: 1, w: 1, h: 1}];

        return (
            /*
            <div className='container'>
                <AppHeader className='header'>header</AppHeader>
                {this.renderData(this.state.text)}                    
                <div className='char-container'>
                    <div className='chart'>
                         {this.renderChart(this.state.series, this.state.span)}
                    </div >
                    <div className='label'> 
                        {this.renderLabel(this.state.labels)}
                    </div>                        
                </div>
                <footer className='footer'>
                    <Button onClick={()=> this.updateChart()}>Plot Chart</Button>  
                </footer>
            </div>
            )
            */
            /*
            <Flexbox flexDirection='column'>

                <Flexbox element="header">
                    <AppHeader element="header" height="60px"></AppHeader>
                </Flexbox>

                <Flexbox>
                    {this.renderData(this.state.text)}                    
                </Flexbox>

                <Flexbox flexGrow={1}>
                    <Flexbox flexDirection="row">
                        {this.renderChart(this.state.series, this.state.span)}
                        {this.renderLabel(this.state.labels)}
                    </Flexbox>
                </Flexbox>

                <Flexbox element="footer">
                    <footer>
                        <Button onClick={()=> this.updateChart()}>Plot Chart</Button>  
                    </footer>
                </Flexbox>
            </Flexbox>
*/

            <div id='mainContainer' class="container-fluid h-100">
                 {/*Style for the Chart*/}
                <link rel="stylesheet" href="https://unpkg.com/react-vis/dist/style.css"></link>
                <link href="css/codemirror.css" rel="stylesheet"></link>     
                
                <div class="container-fluid">   

                    <div id='headerDiv' className='row'>
                        <div className='col  bg-light align-middle'>
                           <p className='text-xl-center font-weight-bold'>Alan's Challenger</p>
                        </div>                        
                    </div>

                    <div id='dataDiv'  className='row'>
                        <div className='col'>
                            {this.renderData(this.state.text)}
                        </div>
                    </div>

                    <div id='chartDiv' className='row flex-nowrap'>

                        <div className='col'>
                            {this.renderChart(this.state.series, this.state.span, this.state.chartHeight)}
                        </div>

                        <div className='col'>
                            {this.renderLabel(this.state.labels, this.state.chartHeight)}     
                        </div>      

                    </div>   

                    <div id='footerDiv' className='row'>
                        <div class="navbar navbar-fixed-bottom bg-light">   
                            <button className={'btn btn-primary'} onClick={()=> this.updateChart()}>Plot Chart</button>     
                        </div>

                    </div>
                                    
                </div>
                
            </div>
             

             /*
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
        */
        )
    }   
}

