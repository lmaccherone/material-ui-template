import React from 'react'
import ReactDOM from 'react-dom'

import {Mixins, Toolbar, ToolbarGroup, ToolbarTitle, Paper, RadioButton, RadioButtonGroup, RaisedButton, Divider} from 'material-ui'
const {StylePropable, StyleResizable} = Mixins

import brace from 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/yaml'
import 'brace/mode/json'
import 'brace/theme/github'

import yaml from 'js-yaml'

import request from '../../../api-request'

export default React.createClass({

  // Boilderplate and React lifecycle methods

  propTypes: {
    onChangeMuiTheme: React.PropTypes.func,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [StylePropable, StyleResizable],

  getInitialState() {
    return {
      mode: 'yaml',
      editorContents: '',
      name: 'Default',
      resultBody: '{}',
      resultStatus: '',
      resultError: '',
      saved: true,
    }
  },

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.editor).children[0].focus()
  },

  // Helpers

  getStyles() {
    return {
      radioButton: {
        float: 'left',
        width: "110px",
        overflow: 'hidden',
        marginTop: '15px',
      },
      buttons: {
        marginLeft: 15,
        marginTop: 10,
      },
      resultBar: {
        color: this.context.muiTheme.rawTheme.palette.textColor,
      },
      resultText: {
        marginTop: 30,
      },

    }
  },

  // Event handlers

  onChangeMode(event, valueSelected) {
    let newContents, newResult
    if (valueSelected == 'yaml' && this.state.mode == 'json') {
      newContents = yaml.safeDump(JSON.parse(this.state.editorContents))
      newResult = yaml.safeDump(JSON.parse(this.state.resultBody))
    }
    if (valueSelected == 'json' && this.state.mode == 'yaml') {
      newContents = JSON.stringify(yaml.safeLoad(this.state.editorContents), null, 2)
      newResult = JSON.stringify(yaml.safeLoad(this.state.resultBody), null, 2)
    }
    if (valueSelected != this.state.mode) {
      this.setState({
        mode: valueSelected,
        editorContents: newContents,
        resultBody: newResult,
        saved: false,
      })
    } else {
      this.setState({
        saved: false,
      })
    }
  },

  onChangeContents(newValue) {
    this.setState({
      saved: false,
      editorContents: newValue,
    })
  },

  runAggregation() {
    let body
    if (this.state.mode == 'json') body = JSON.parse(this.state.editorContents)
    else body = yaml.safeLoad(this.state.editorContents)
    request('/api/aggregation', body, (err, result) => {
      if (err) {
        this.setState({
          resultBody: err.message,
          resultStatus: err.status,
        })
      } else {
        let resultBody
        if (this.state.mode == 'yaml') {
          resultBody = yaml.safeDump(result.body)
        } else {
          resultBody = JSON.stringify(result.body, null, 2)
        }
        this.setState({
          resultBody: resultBody,
          resultStatus: result.status,
        })
      }
    })
  },

  saveAnalysisSpec() {
    request('/api/save-analysis-spec', this.state, (err, result) => {
      let saveResult
      if (err) {
        console.log(err)
        this.setState({
          saved: false,
        })
      } else {
        this.setState({
          saved: true,
        })
      }
    })
  },

  onBlur() {
    if (! this.state.saved) {
      this.saveAnalysisSpec()
    }
  },

  render() {
    let styles = this.getStyles()
    return (
      <Paper zDepth={2}>
        <Toolbar style={styles.resultBar}>
          <RadioButtonGroup
            valueSelected={this.state.mode}
            name="shipSpeed"
            onChange={this.onChangeMode}>
            <RadioButton
              style={styles.radioButton}
              value="yaml"
              label="YAML"
            />
            <RadioButton
              style={styles.radioButton}
              value="json"
              label="JSON"
            />
          </RadioButtonGroup>
          <RaisedButton label="Run" secondary={true} style={styles.buttons} onTouchTap={this.runAggregation} />
          <RaisedButton label="Save as..." secondary={true} style={styles.buttons} />
          <ToolbarTitle style={{float: 'right'}} text={"Saved: " + this.state.saved} />
        </Toolbar>
        <AceEditor
          ref="editor"
          mode={this.state.mode}
          value={this.state.editorContents}
          theme="github"
          name="editor"
          width="100%"
          showPrintMargin={false}
          editorProps={{$blockScrolling: true}}
          onChange={this.onChangeContents}
          onBlur={this.onBlur}
          tabSize={2}/>
        <Toolbar style={styles.resultBar}>
          <ToolbarTitle text={"Result: " + this.state.resultStatus} />
        </Toolbar>
        <AceEditor
          mode={this.state.mode}
          value={this.state.resultBody}
          theme="github"
          name="result"
          width="100%"
          readOnly={true}
          showPrintMargin={false}
          editorProps={{$blockScrolling: true}}
          tabSize={2} />

      </Paper>

    )
  }

})

