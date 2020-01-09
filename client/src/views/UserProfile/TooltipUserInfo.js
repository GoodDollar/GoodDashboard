import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import userModel from '../../lib/gun/models/user'
import GridContainer from 'components/Grid/GridContainer.js'
import Card from 'components/Card/Card.js'
import CardAvatar from 'components/Card/CardAvatar.js'
import CardBody from 'components/Card/CardBody.js'
import logo from '../../assets/img/logoPrimary.svg'

const HtmlTooltip = withStyles(theme => ({
tooltip: {
  backgroundColor: '#f5f5f9',
  color: 'rgba(0, 0, 0, 0.87)',
  maxWidth: 250,
  height: 50,
  fontSize: theme.typography.pxToRem(12),
  border: '1px solid #dadde9',
},
}))(Tooltip);

/**
 * @return {null}
 */

export default function TooltipUserInfo({hash}) {
  const [user, setUser] = useState(false)

  const loadUser = async () => {
    const userFromGun = await userModel.getByAddress(hash)
    setUser(userFromGun)
  }

  useEffect(() => {
    loadUser()
  }, [])

  if (!user) return null

  return (
      <HtmlTooltip title={
          <React.Fragment>
            <GridContainer >
              <Card profile>
                <CardAvatar profile>
                    <img src={user.avatar ? user.avatar : logo} alt="..." />
                </CardAvatar>
                <CardBody profile>
                  <h6 >User full name: {user.fullName}</h6>
                </CardBody>
              </Card>
            </GridContainer>
          </React.Fragment>
        }
      >
        <Button>{hash}</Button>
      </HtmlTooltip>
  )
}