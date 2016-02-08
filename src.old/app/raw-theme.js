// import Colors from '../colors';
// import ColorManipulator from '../../utils/color-manipulator';
// import Spacing from '../spacing';
// import zIndex from '../zIndex';
import {Styles, Utils} from 'material-ui';
const {Colors, Spacing} = Styles;
const {ColorManipulator} = Utils;

export default {
  spacing: Spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: Colors.deepOrange700,
    primary2Color: Colors.deepOrange700,
    primary3Color: Colors.lightBlue50,
    accent1Color: Colors.lightBlue800,
    accent2Color: Colors.lightBlue800,
    accent3Color: Colors.lightBlue800,
    textColor: '#272727',
    alternateTextColor: Colors.grey50,
    canvasColor: Colors.grey50,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: '#272727',
    clockCircleColor: '#272727',
  },
};
