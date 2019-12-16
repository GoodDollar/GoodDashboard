import React from 'react'
import { Pie } from '@nivo/pie'

const commonProperties = {
  width: 550,
  height: 400,
  animate: true,
  fit: true,
  enableRadialLabels: true,
  enableSlicesLabels: true,
  slicesLabelsSkipAngle: 8,
  radialLabelsTextColor: 'inherit',
  radialLabelsSkipAngle: 8,
  padAngle:1,
  innerRadius:0.5,
  cornerRadius:2,
  margin: {
    top: 60,
    bottom: 60,
    left: 150,
    right: 150,
  },
}


export default (props) => {
  return (
    <Pie
      {...commonProperties}
      {...props}
    />
  )
}
