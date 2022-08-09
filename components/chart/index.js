import React from 'react';
import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

function Chart({ res, modalIsOpen }) {
  let layout = {
    width: 800,
    height: 230,
  }
  let config = {
    responsive: true
  }

  let data = [{
    type: "indicator",
    mode: "number+gauge+delta",
    value: null,
    gauge: {
      shape: "bullet",
      axis: {
        range: []
      },
      threshold: {
        line: {
          color: "red",
          width: 2
        },
        thickness: 0.75,
        value: null
      },
      steps: []
    }
  }]
  res.ranks.map((rank) => {
    data[0].gauge.steps.push({
      range: [rank.from_value || res.chart.min_value, rank.to_value || res.chart.max_value],
      color: rank.color_hex,
      title: 'test'
    })
  })

  data[0].value = res.input_fields[0].converted_value || res.chart.min_value
  data[0].gauge.threshold.value = res.output_fields[0].converted_value
  data[0].gauge.axis.range.push(res.chart.min_value, res.chart.max_value)

  return (
    res && (
      <div id="chart-rank">
        <Plot
          data={data}
          layout={layout}
          config={config}
        />
      </div>
    )
  )
}

export default Chart