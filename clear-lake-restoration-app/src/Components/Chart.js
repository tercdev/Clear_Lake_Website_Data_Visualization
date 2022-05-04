import React, {useRef, useEffect} from "react";
import HighchartsReact from "highcharts-react-official";

function Chart(props) {
    const chartComp = useRef(null);
    // useEffect(() => {
    //     let chartObj = chartComp.current.chart;
    //     chartObj.showLoading();
    //     setTimeout(() => chartObj.hideLoading(), 2000);
    // })
    return (
    <HighchartsReact
        highcharts={props.highcharts}
        constructorType={"chart"}
        options={props.options}
        ref={chartComp}
    />
    );
};

export default Chart;