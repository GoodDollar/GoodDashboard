import React from 'react'
import { ResponsiveLine } from '@nivo/line'

export default ({ legendX='',legendY='', height = 300 ,...props}) => (
  <div style={{ height }}>
    <ResponsiveLine
      margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', stacked: true, min: 'auto', max: 'auto' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: legendX,
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: legendY,
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel={legendY}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'top-left',
          direction: 'row',
          justify: false,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 100,
          translateX: -6,
          translateY: -29,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
        },
      ]}
      {...props}
    />
  </div>
)
