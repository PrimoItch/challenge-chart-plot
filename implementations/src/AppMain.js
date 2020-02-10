import EventChart from './Components/EventChart'
import DataLabels from './Components/DataLabels'
import DataInput from './Components/DataInput'

import JSON5 from 'json5'
import React, { Component } from 'react'
import AppHeader from './Components/AppHeader'

export default class AppMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            series: [],
            span: [],
            labels: [],
            chartHeight: '0px',
            dataHeight: 0,
            proportion: 0.3
        }

    }

    renderData() {
        return (
            <DataInput className='dataImput'
                height={this.state.dataHeight}
                onChange={
                    (newText) => {
                        this.setState({ text: newText })
                    }}
            ></DataInput>
        )
    }

    renderChart(data, span, height) {
        return (
            <EventChart span={span} dataToBePloted={data} height={height}>
            </EventChart>
        )
    }

    renderLabel(labels, height) {
        return (
            <DataLabels labels={labels} height={height}></DataLabels>
        )
    }

    updateChart = () => {
        const dataText = this.state.text.split('\n')
        var events = [];

        for (var i = 0; i < dataText.length; i++) {
            if (dataText[i] === '') { continue; }

            try {
                events.push(JSON5.parse(dataText[i]))
            }
            catch (e) {
                alert('The data supplied on line ' + (i + 1) + ' is not in json format. Please review your data.')
                return;
            }
        }

        var startEventHasCalled = false;
        var timeSpanSetted = false;
        var groups = []
        var selects = []
        var beginTimestamp;
        var endTimestamp;
        var stopReached = false;
        var chartData = []
        var series = [];

        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            if (event.type === 'start') {
                groups = event.group
                selects = event.select
                startEventHasCalled = true;
                continue;
            }

            if (event.type === 'span') {
                beginTimestamp = event.begin;
                endTimestamp = event.end;
                timeSpanSetted = true;
                continue;
            }

            if (event.type === 'data') {
                if (startEventHasCalled == false && timeSpanSetted == false) {
                    alert('A start and a span event are expected before a data event. Please review your data.')
                    return;
                }
                if (startEventHasCalled == false) {
                    alert('A start is expected before a data event. Please review your data.')
                    return;
                }
                if (timeSpanSetted == false) {
                    alert('A span is expected before a data event. Please review your data.')
                    return;
                }

                var eventGroups = [];
                var eventSelections = [];
                for (var property in event) {
                    var propertyValue = event[property]

                    if (groups.indexOf(property) >= 0) {
                        eventGroups.push(propertyValue);
                    }
                    if (selects.indexOf(property) >= 0) {
                        eventSelections.push({ 'property': property, 'value': propertyValue });
                    }
                }

                eventGroups.sort();
                eventSelections.sort();
                var seriesName = '';
                for (var groupIndex = 0; groupIndex < eventGroups.length; groupIndex++) {
                    seriesName += eventGroups[groupIndex] + "_"
                }

                for (var selectionIndex = 0; selectionIndex < eventSelections.length; selectionIndex++) {
                    var seriesKeyName = seriesName + eventSelections[selectionIndex].property;
                    if (seriesKeyName in series) {
                        series[seriesKeyName]['data'].push({ 'x': event.timestamp, 'y': eventSelections[selectionIndex].value });
                    } else {
                        series[seriesKeyName] = { 'key': seriesKeyName, 'data': [{ 'x': event.timestamp, 'y': eventSelections[selectionIndex].value }] }
                    }
                }
                continue;
            }

            if (event.type === 'stop') {
                // All data after stop event should be ignored
                break;
            }
        }

        var seriesToPlot = []
        var seriesLabels = [];
        for (var property in series) {
            seriesToPlot.push(series[property])
            seriesLabels.push(property)
        }

        this.setState({ series: seriesToPlot, span: [beginTimestamp, endTimestamp], labels: seriesLabels });
    }

    componentDidMount() {
        this.updateChartHeight();

        window.addEventListener("resize", this.updateChartHeight.bind(this));

        var resizer = document.getElementById('resizer')

        resizer.addEventListener('mousedown', () => {

            window.addEventListener('mousemove', this.resizeDataInput)

            window.addEventListener('mouseup', () => {
                window.removeEventListener('mousemove', this.resizeDataInput)
            })
        })
    }

    resizeDataInput = (e) => {
        var root = document.getElementById('root')
        var rootHeight = root.clientHeight

        var proportion = e.pageY / rootHeight;
        if (proportion > 0.85) {
            proportion = 0.85
        }
        if (proportion < 0.15) {
            proportion = 0.15
        }
        this.setState({ proportion: proportion })
        this.updateChartHeight()
    }


    componentWillUnmount() {
        window.removeEventListener("resize", this.updateChartHeight.bind(this));
    }

    updateChartHeight() {
        var mainContainer = document.getElementById('mainContainer')

        var header = document.getElementById('headerDiv');
        var data = document.getElementById('dataDiv');
        var footer = document.getElementById('footerDiv');
        
        var mainContainerHeight = mainContainer.clientHeight;
        var dataHeight = data.clientHeight;
        var footerHeight = footer.clientHeight;
        var headerHeight = header.clientHeight;

        var total = (mainContainerHeight - footerHeight - headerHeight);
        var chartHeight = (1 - this.state.proportion) * total;
        var dataHeight = this.state.proportion * total;

        this.setState({ chartHeight: chartHeight, dataHeight: dataHeight })
    }

    render() {

        return (

            <div id='mainContainer' class="container-fluid h-100">

                {/*Style for react-vis chart*/}
                <link rel="stylesheet" href="https://unpkg.com/react-vis/dist/style.css"></link>
                <link href="css/codemirror.css" rel="stylesheet"></link>

                <div class="container-fluid">

                    <div id='headerDiv' className='row'>
                        <div className='col bg-secondary align-middle'>
                            <AppHeader></AppHeader>
                        </div>
                    </div>

                    <div id='dataDiv' className='row'>
                        <div className='col' style={{ "height": this.state.dataHeight, "min-height": '50px', "padding": "0px" }}>
                            {this.renderData(this.state.text, this.state.dataHeight)}
                        </div>
                    </div>

                    <div id='resizer' className='row justify-content-center nopadding nomargin' style={{ "height": '0px' }} >
                        <div className='resizer'>
                            =
                        </div>
                    </div>

                    <div id='chartDiv' className='row flex-nowrap'>
                        <div className='col-9'>
                            {this.renderChart(this.state.series, this.state.span, this.state.chartHeight)}
                        </div>

                        <div className='col-3'>
                            {this.renderLabel(this.state.labels, this.state.chartHeight)}
                        </div>

                    </div>

                    <div id='footerDiv' className='row'>
                        <div class="col navbar navbar-fixed-bottom bg-secondary">
                            <button className={'btn btn-primary'} onClick={() => this.updateChart()}>GENERATE CHART</button>
                        </div>

                    </div>

                </div>

            </div>

        )
    }
}

