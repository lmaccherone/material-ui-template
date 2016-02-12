# [Material-UI Template](https://github.com/lmaccherone/material-ui-template)

This is a template site that you can use as a starting point for your Material-UI (MUI) project. I created it by starting
with the MUI docs site, but there are significant differences:

* **Stands alone**. The MUI docs site is a subfolder of the main MUI project and components in the docs site references 
  its parent. While it's not hard to tease this apart for someone who is familiar with webpack, npm, React, and MUI, 
  it's not fun to have to do that before diving into your first MUI project... especially for newbies.
  
* **DRY and n-levels of left nav menu**. To add/modify the left nav of the original MUI docs, you had to modify no 
  less than three different source files. This template will automatically adjust the left-nav based upon app-routes.js
  including n-levels deep.
  
* **Custom theme in the project**. MUI is designed to be themable and comes with two nice themes, but it's not 
  immediately obvious how to  activate a custom theme in context for all components. The Themes page now has three 
  themes and it defaults to the custom one, so if you remove the Themes page, it will start up with your theme rather 
  than one of the prebuilt ones. Just modify customBaseTheme.js.
  
* **Highcharts**. There is an example chart page that uses Highcharts.

## Requirements

- [Node](https://nodejs.org) 4.0 or newer
- [React Native](http://facebook.github.io/react-native/docs/getting-started.html) for development
- [Xcode](https://developer.apple.com/xcode/) for iOS development (optional)
- [Android SDK](https://developer.android.com/sdk/) for Android development (optional)

## Installation
After cloning the repository, install dependencies:
```sh
cd <project folder>/material-ui-template
npm install
```

## Running

Once dependencies are installed, start the application with:

### Browser

```sh
npm run browser:development
```

Open `http://localhost:3000` to view the template site.

### iOS

```sh
npm run native:development
```

Open `ios/iosApp.xcodeproj` in Xcode, build and run the project.

### Android

```sh
npm run native:development
npm run android:setup-port
react-native run-android
```
