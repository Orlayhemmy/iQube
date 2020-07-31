import React from "react"
import { Container, Grid, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'

const fields = [
  { name: "name", placeholder: "OPara Linus Ahmed"},
  { name: "email address", placeholder: "OPara Linus Ahmed"},
  { name: "address 1", placeholder: "OPara Linus Ahmed"},
  { name: "address 2", placeholder: "OPara Linus Ahmed"},
]

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
      marginTop: "16px",
    },
    "& select::before": {
      paddingRight: "10px"
    },
    "& .MuiTypography-body1": {
      textTransform: "capitalize",
      fontWeight: "bold",
    }
  }
}))

const PersonalInfo = () => {
  const classes = useStyles()
  
  return (
    <Container className={classes.root}>
      <Grid container justify="center" direction="column" spacing={5}>
        {fields.map(({ name, placeholder }) => <Grid style={{ marginTop: "36px" }} xs={11}>
          <Typography>{name}</Typography>
          <input placeholder={placeholder} />
        </Grid>)}
        <Grid container spacing={8} style={{ marginTop: "8px" }}>
          <Grid item xs={8}>
            <Typography>Local Government</Typography>
            <input placeholder={"Surulere"}/>
          </Grid>
          <Grid item xs={4}>
            <Typography>State</Typography>
            <select>
              <option>Lagos</option>
            </select>
          </Grid>
        </Grid>
      </Grid>
      
    </Container>
  )
}

export default PersonalInfo
