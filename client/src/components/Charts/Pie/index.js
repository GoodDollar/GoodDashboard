import React from 'react'
import { Pie } from '@nivo/pie'

const commonProperties = {
  width: 400,
  height: 400,
  margin: { top: 30, right: 30, bottom: 30, left: 30 },
  animate: true
}
console.log(commonProperties)
export default (props) => {
  return (
    <Pie {...commonProperties} {...props} />
  )
}
