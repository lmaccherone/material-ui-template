import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import {Colors, Spacing} from 'material-ui/lib/styles';

export default {
  spacing: Spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#DE1E54',  // App Bar background, Tab bar background, completed (left) part of slider, checkboxes/radio selected, toggle-on color
    primary2Color: Colors.cyan700,  // Background for heading on date picker, selected date background
    primary3Color: Colors.grey600,  // Background of toggles
    accent1Color: Colors.grey400,  // Tab active indicator, Primary button background, Snackbar action text
    //accent2Color: '#DE1E54',  // Toggle-off color
    accent2Color: Colors.black,  // Toggle-off color
    accent3Color: ColorManipulator.fade(Colors.black, 0.5),  // Hover color for right side of slider
    textColor: ColorManipulator.fade(Colors.fullWhite, 0.8),  // Most text, dropdowns, etc.
    alternateTextColor: Colors.black,  // Text in AppBar, Text for selected Tab, background for default button, text for primary and secondary buttons
    canvasColor: '#0B253D',
    borderColor: ColorManipulator.fade(Colors.fullWhite, 0.5),  // Underline for text fields (unfocused), round button on disabled toggles, Dividers
    disabledColor: ColorManipulator.fade(Colors.fullWhite, 0.3),  // Hint text, text on disabled things
    pickerHeaderColor: Colors.green700,
    //clockCircleColor: ColorManipulator.fade(Colors.fullWhite, 0.12),
    clockCircleColor: Colors.green700,
  },
};
