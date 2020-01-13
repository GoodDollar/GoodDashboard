import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const styles = {
  mainBlock: {
    cursor: "pointer",
    display: "inline-block"
  },
  titleBlock: {
    float: "left",
    marginTop: 2,
  }
}
const useStyles = makeStyles(styles);


export default function SortTitle(props) {
  const classes = useStyles();
  const { title, sortFieldNow, field, direction, onPress} = props;
  const directionIcon = {
    asc : (<i className="material-icons">
      arrow_drop_up
    </i>),
    desc: (
      <i className="material-icons">
        arrow_drop_down
      </i>
    )
  }
  const handlerOnPress = () => {
    const newDirection = direction === 'desc' ? 'asc' : 'desc'
    onPress && onPress(field, newDirection)
  }

  return (<div className={classes.mainBlock} onClick={handlerOnPress}>
      <div className={classes.titleBlock}> {title}</div>
      {
        (sortFieldNow === field)
        ? (directionIcon[direction])
          : null
      }
    </div>
  );
}
