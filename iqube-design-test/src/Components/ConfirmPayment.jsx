import React from "react"
import { Container, Typography, Box } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 0,
    color: "#191a5dd1",
    boxShadow: "0px 10px 20px #0000002b",
    borderRadius: "0 0 10px 10px",

    "& .MuiTypography-body1": {
      fontSize: "20px",

    },
    "& .MuiTypography-body1:last-child": {
      fontWeight: "bold"
    },
    
    "& > .MuiBox-root:first-child": {
      display: "flex",
      justifyContent: "space-between",
      padding: "18px 64px",
      color: "#ffffff",
      backgroundColor: "#0798ff",
      borderRadius: "10px 10px 0 0",

      "& .MuiTypography-body1": {
        fontSize: "16px",
        fontWeight: "bold",
        textTransform: "capitalize"
      }
    },
    "& > .MuiBox-root:nth-child(2)": {
      backgroundColor: "#ffffff",
      padding: "32px 64px",

      "& .MuiBox-root": {
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 0",
      }
    },
    "& > .MuiBox-root:nth-child(3)": {
      backgroundColor: "#ffffff",
      padding: "0 40px",
      borderRadius: "0 0 10px 10px",
      
      "& .MuiBox-root": {
      padding: "48px 12px",
      borderTop: "1px solid #0000ac",

        "& > div:last-child": {
          display: "flex",
          justifyContent: "space-between",
          border: "1px solid #0000ac",
          padding: "15px",
          borderRadius: "8px"
        }
      }
    }
  }
}))

const ConfirmPayment = () => {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <Box>
        <Typography>Item name</Typography>
        <Typography>N Price</Typography>
      </Box>
      <Box>
        <Box>
          <Typography>Data science and usability</Typography>
          <Typography>50,0000.00</Typography>
        </Box>
        <Box>
          <Typography>Shipping</Typography>
          <Typography>0.00</Typography>
        </Box>
      </Box>
      <Box>
        <Box>
          <div>
            <Typography>Total</Typography>
            <Typography>50,0000.00</Typography>
          </div>
        </Box>
      </Box>
    </Container>
  )
}

export default ConfirmPayment
