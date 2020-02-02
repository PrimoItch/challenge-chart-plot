import React from 'react';
import PlotChartButton from './Components/PlotChartButton'
import EventChart from './Components/EventChart'
import DataLabels from './Components/DataLabels'
import AppHeader from './Components/AppHeader'
import DataInput from './Components/DataInput'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

function App() {

  return (
    <div spacing={2}>  
      {/*Style for the Chart*/}
      <link rel="stylesheet" href="https://unpkg.com/react-vis/dist/style.css"></link>
      <link href="css/codemirror.css" rel="stylesheet"></link>


      <Grid container direction="column" justify="center" >

        <Grid container item xs={12}>     
          <AppHeader></AppHeader>
        </Grid>

        <Grid container>
          <Grid item xs={12}>     
            <DataInput></DataInput>
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
            <PlotChartButton></PlotChartButton>
          </Grid> 
        </Grid>

       </Grid>

    </div>
  );
}

export default App;
