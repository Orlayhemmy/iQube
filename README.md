# Introduction 
This is the profiling management service for the stanbic mobile app.
It handles device binding, image upload.

# Getting Started
1. You must have [Nodejs](https://nodejs.org/en/) installed on your system.
2. It comes with a package manager, NPM.

# Build
1. On your terminal, run this command, `npm install` to install on the dependencies needed.
2. To build and run the application, use this command `npm run dev`
# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 


# API Documentation

### BASE URL - https://stanbic-profile.nibse.com

- **POST** - /api/login/logs - Check Data Policy and Device Binding

  - **params**:
    - **deviceID**: `String`
    - **userID**: `String`
    - **CifId**: `String`
    - **Token**: `String` - This is the auth token when you login from the bank's api

If response has a `status 201` in the response body, that means user hasn’t done data policy yet.  
If response has a `status 202`, that means user has not done device binding. An `OTP` is sent to the user and a `reference` is also returned.  
If response has a `status 200`, user can proceed to the dashboard.  

- **POST** - /api/device/binding - To Bind Device

  - **params**:
    - **deviceName**: `String`
    - **deviceID**: `String`
    - **deviceOS**: `String`
    - **Otp**: `String` - OTP gotten by the user
    - **Reference**: `String` - The reference returned from previous endpoint.
    - **userID**: `String`
    - **Token**: `String` - This is the auth token when you login from the bank's api


- **POST** - /api/device/unlink - To Unlink device

  - **params**: 
    - **userID**: `String`
    - **deviceID**: `String`
    - **Otp**: `String`,
    - **Reference**: `String`
    - **Token**: `String`

  For user to unlink device if they’re not logged in, You take their userId and password, attempt login and call the OTP endpoint to send otp to them.
  Then after, call this endpoint to unlink device

