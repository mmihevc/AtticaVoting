import React from 'react';
import Paper from '@material-ui/core/Paper';
import {Chart, BarSeries, Title, ArgumentAxis, ValueAxis,} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';

const data = [  { label: "Maddie",  y: 20},
    { label: "Derek", y: 15},
    { label: "Waylon", y: 25},
    { label: "Christian", y: 30},
    { label: "Arlo",  y: 45}];

function Results () {

    return (
        <Paper>
            <Chart
                data={data}
            >
                <ArgumentAxis />
                <ValueAxis max={7} />
                    <BarSeries
                        valueField="Votes"
                        argumentField="Name"
                    />
                    <Title text="Worlds Greatest Programmer" />
                    <Animation />
                </Chart>
            </Paper>
        );
}

export default Results;