import React from 'react'
import { Pie } from '@nivo/pie'

const commonProperties = {
  width: 400,
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
    top: 30,
    bottom: 30,
    left: 30,
    right: 30,
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
