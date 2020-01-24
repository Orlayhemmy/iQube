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

### SWAGGER DOC - /api-docs
```js
{
    Authorization: `Bearer  a1f94dfe0b38c6fe98b68f754389c781f7836b0074cf61eee749ae1c989a218a`
}

```


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

- **POST** - /api/device/all - View all user's linked devices

  - **param**:
    - **userID**: `String`


- **POST** - /api/mybank/add/beneficiary - Add Beneficiary

  - **params**:
    - **userId**: `String`
    - **beneficiaryAlias**: `String`
    - **beneficiaryName**: `String`
    - **beneficiaryAccountNumber**: `String`
    - **beneficiaryBank**:`String`
    - **beneficiaryBankCode**: `String`
    - **beneficiaryEmailAddress**: `String`
    - **beneficiaryReference**: `String`
    - **customerReference**: `String`
    - **otp**: `String`
    - **otpReference**: `String`
    - **Token**:  `String`
    - **Image**: `String` - Base64 Image of the beneficiary


- **POST** - /edit/beneficiary - Edit Beneficiary

  - **params**:
    - **sessionId**: `String`
    - **UserId**: `String`
    - **beneficiaryReference**: `String`
    - **OTP**: `String`
    - **BeneficiaryId**: `String`
    - **SourceReferenceId**: `String`
    - **customerReference**:  `String`
    - **Token**: `String`
    - **image** : `String`

- **POST** - /api/mybank/fetch/beneficiary - Fetch Beneficiary

  - **params**:
    - **AccountNo**: `String`
    - **UserId**: `String`
    - **Token**: `String`

- **POST** - /api/transaction/history - fetching transaction history

  - **params**:
    - **AccountNumber**: `String` - Account number you want history for
	  - **UserId**: `String`
	  - **Token**: `String` - Your logged in token


- **POST** - /api/mybank/addprofile - ADD PROFILE PICTURE

  - **params**:
    - **userID**: `String`
	  - **image**: `String` Base64 image

- **POST** - /api/mybank/viewprofile - VIEW PROFILE PICTURE

  - **params**:
    - **userID**: `String`

- **POST** - /api/atease/device/link - Device Linking For @ease

  - **params:
    - **UserId**: `String`
	  - **deviceID**: `String`
	  - **deviceName**: `String`
	  - **deviceOS**: `String`
	  - **OTP**: `String`
	  - **OTPReference**: `String`


- **POST** - /api/atease/device/login - @ease Login logs

  - **params**:
    - **UserId**: `String`
	  - **deviceID**: `String`

If response has a `status 202`, that means user has not done device binding. An OTP is sent to the user and a reference is also returned.  
If response has a `status 200`, user can proceed to the dashboard.

- **POST** - /api/atease/device/unlink - To Unlink Device

  - **params**:
    - **UserId**: `String`
	  - **deviceID**: `String`
	  - **OTP**: `String`
	  - **OTPReference**: `String`


- **POST** - /api/atease/device/all - To view linked devices

  - **params**:
    - **userID**: `String`

- **POST** - /api/atease/addprofile - Add user’s profile image

  - **params**:
    - **UserId**: `String`
	  - **image**: `String` base64 image

- **POST** - /api/atease/viewprofile - View user’s profile image

  - **params**:
    - **UserId**: `String`