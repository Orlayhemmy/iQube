import React from "react"
import { Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "100px 0",

    "& button": {
      padding: "20px 92px",
      color: "#ffffff",
      background: "linear-gradient(#ffd400fc, #ff8e02)",
      border: "transparent",
      borderRadius: "10px",
      fontSize: "18px",
      fontWeight: "bold"
    },
    "& button:last-child": {
      background: "transparent",
      color: "#35417ee6"
    }
  }
}))

const ActionButtons = ({ value, setValue }) => {
  const classes = useStyles()

  return (
    <Grid container className={classes.root}>
      <button onClick={() => setValue(value+1)}>{value === 2 ? "Pay" : "Next"}</button>
      <button>Cancel Payment</button>
    </Grid>
  )
}

export default ActionButtons
