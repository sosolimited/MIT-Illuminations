# Signing and Notarizing on macOS

Recent versions of macOS prevent the opening of downloaded apps that are not signed and 
notarized. Although an unsigned build may appear to work on your local machine, 
others will have issues. Others may see errors like "unidentified developer" or "damaged" application.
Signing and notarizing requires a paid Apple Developer account.

The MIT Illuminations repo is setup to automatically sign and notarize builds
after you do some one-time environment setup as outlined below.

## 1. Get a Developer ID Certificate from Apple

1. Sign into your Apple developer account in XCode
2. Preferences -> Accounts -> [Your apple ID] -> Manage Certificates (bottom right)
3. Click "+" icon in bottom left -> "Developer ID Application"
4. You should see the new certificate listed. Click Done.

You now have a certificate for signing the app, which the build process will
automatically find and use.

## 2. Create an application specific password for your Apple account

The notarization process needs to authenticate with Apple's servers, which requires
your AppleID and password. You create an application specific password on your
account instead of providing your main password.

Following the [instructions here](https://support.apple.com/en-us/HT204397) and 
then copy the password for the next steps.

## 3. Configure environment vars for the build script

Finally, you need to configure an environment file with a few account settings.

Create a new file in the root of the repo: `.env.local`:

```
APPLEID = "MyAppleAcct@gmail.com"
APPLEIDPASS = "app-specific-password"
APPLETEAMID = "short-team-identifier"
```

Note: you can find the short Team ID on your [Apple Developer account dashboard](https://developer.apple.com/account/) under "Membership Details".

## 4. Build the application

```
npm run make-mac-release
```

The "signing" step might sit there for awhile because it's uploading the apps
to Apple.

## Further reading

- Signing electron apps: https://www.electron.build/code-signing 
- Notarizing electron apps: https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
