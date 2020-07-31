import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import PersonalInfo from './Components/PersonalInfo'
import { Container, Grid } from '@material-ui/core'
import BillingInfo from './Components/BillingInfo'
import ConfirmPayment from './Components/ConfirmPayment'
import ActionButtons from './Components/ActionButtons'
import Complete from './Components/Complete'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={6}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "0 auto",

    "& .MuiTabs-root": {
      overflow: "visible",
      marginTop: "32px",
    },  
    "& .MuiTabs-flexContainer": {
      borderBottom: "1px solid #000",
      margin: "6px 0",
      justifyContent: "space-between",
    },
    "& .PrivateTabIndicator-colorPrimary-3": {
      backgroundColor: "#fd985e"
    },
    "& .MuiTab-wrapper": {
      fontWeight: "bold",
      textTransform: "capitalize",
      alignItems: "flex-start",
      padding: "0",
      fontSize: "20px",
      paddingBottom: "12px",
      color: "#808080",
    },
    "& .MuiTab-textColorInherit.Mui-selected": {
      padding: 0,

      "& span": {
        color: "#fd985e !important",
      }
    },
    "& .PrivateTabIndicator-root-2": {
      height: "12px",
      borderRadius: "5px",
    }
  },

 
}))

const App = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Container style={{
      padding: "100px 0",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      }}>
      <Grid xs={6} className={classes.root}>
        {
          value === 3
            ? <Complete />
            : (
              <>
                <Typography style={{ color: "#35417ee6", fontWeight: "bold" }} variant="h4">Complete your Purchase</Typography>
                <Tabs value={value} onChange={handleChange} indicatorColor="primary" aria-label="simple tabs example">
                  <Tab label="Personal Info" {...a11yProps(0)} />
                  <Tab label="Billing Info" {...a11yProps(1)} />
                  <Tab label="Confirm Payment" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <PersonalInfo />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <BillingInfo />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <ConfirmPayment />
                </TabPanel>
                <ActionButtons value={value} setValue={setValue} />
              </>
            )
        }
      </Grid>
    </Container>
  )
}

export default App
