import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'
import { ReactComponent as CheckIcon } from "../assets/check.svg"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: "40vh",
    padding: "84px",
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0px 10px 20px #0000002b",

    "& div": {
      background: "#ffffff",
      boxShadow: "0px 10px 20px #8c86862b",
      borderRadius: "50%",
      padding: "10px",
      margin: "0 auto",

      "& svg": {
        width: "60px",
        color: "#1ad01a"
      }
    },

    "& .MuiTypography-h3": {
      color: "#35417ee6",
      margin: "14px 0"
    },

    "& .MuiTypography-body1": {
      fontSize: "18px",
      margin: "16px 0"
    },

    "& .MuiTypography-body1:last-child": {
      color: "#ff8e02",
      textDecoration: "underline",
    }
  }
}))

const Complete = ({ value, setValue }) => {
    const classes = useStyles()
  
    return (
      <Grid container className={classes.root}>
        <div>
          <CheckIcon />
        </div>
       <Typography variant={"h3"}>Purchase Completed</Typography>
       <Typography>Please check your mail for email concerning this transaction</Typography>
       <Typography>Return Home</Typography>
      </Grid>
    )
  }
  
  export default Complete