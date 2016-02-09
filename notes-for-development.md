# Worries

* I have a few things in peerDependencies in package.json. Not sure if you do a clean install that this will result in a working system. Need to confirm. If it fails move them back into devDependencies.

~~* Still getting an error on babylon module~~ This and other errors went away when I deleted the Components section which relied heavily on the parent (`material-ui`) directory in the `material-ui/docs` example.

        WARNING in ./~/babylon/index.js
        Critical dependencies:
        1:480-487 This seems to be a pre-built javascript file. Though this is possible, it's not recommended. Try to require the original source to get better results.
         @ ./~/babylon/index.js 1:480-487


# Notes

## Font/SVG Icons

To use FontIcon, first import the icons you want:

    {NavigationCancel, ActionCheckCircle} = require('material-ui/lib/svg-icons')

Then, specify them as if they were html tags or components, because they are:

    <NavigationCancel />
    <ActionCheckCircle />
    
## Get rawTheme from context
    
Here is how to get the rawTheme from the current context. This is far more desirable to setting it manually.

    rawTheme = this.context.muiTheme.rawTheme
    
## ColorManipulator
    
    ColorManipulator.fade(Colors.fullWhite, 0.3)