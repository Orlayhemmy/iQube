import React from "react"
import { Container, Grid, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,

    "& input, select": {
      height: "56px",
      borderRadius: "10px",
      padding: "0 24px",
      fontSize: "18px",
      borderWidth: "1px",
      width: "100%",
      marginTop: "16px"
    },
    "& .MuiTypography-body1": {
      textTransform: "capitalize",
      fontWeight: "bold",
    },
  }
}))

const BillingInfo = () => {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <Grid container justify="center" direction="column" spacing={5}>
        <Grid item xs={11} style={{ padding: "18px 0" }}>
          <Typography>Name on Card</Typography>
          <input placeholder={"OparaLinusAhmed"} />
        </Grid>
        <Grid item style={{  padding: "18px 0" }}>
          <Typography>Card Type</Typography>
          <select>
            <option>Visa</option>
          </select>
        </Grid>
        <Grid container style={{ justifyContent: "space-between", marginTop: "15px" }}>
          <Grid item xs={5}>
            <Typography>Card Details</Typography>
            <input placeholder={"4452 4452 4452 4452"} />
          </Grid>
          <Grid item xs={3} style={{ textAlign: "center", marginLeft: "48px" }}>
            <Typography>Expiry Date</Typography>
            <input placeholder={"04 / 23"} style={{ textAlign: "center", padding: "0"}} />
          </Grid>
          <Grid item xs={2} style={{ textAlign: "center" }}>
            <Typography>CVV</Typography>
            <input placeholder={"112"} style={{ textAlign: "center", padding: "0"}}/>
          </Grid>
          
        </Grid>
      </Grid>
    </Container>
  )
}

export default BillingInfo
