import React from 'react'
import ReactDOM from 'react-dom'

import {
  Mixins,
  Toolbar, ToolbarGroup, ToolbarTitle,
  Paper,
  RaisedButton, FlatButton,
  Divider,
  DropDownMenu, MenuItem,
  Toggle,
  IconButton,
  Dialog,
  TextField,
  Tab, Tabs,
} from 'material-ui'
import {ActionLaunch, ActionDelete, ActionSettings, ContentSave, ContentAddCircle} from 'material-ui/lib/svg-icons'
const {StylePropable, StyleResizable} = Mixins
import {Colors} from 'material-ui/lib/styles'

import brace from 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/yaml'
import 'brace/mode/json'
import 'brace/theme/github'

import yaml from 'js-yaml'
import _ from 'lodash'

import request from '../../../api-request'
import AdvancedTable from '../../AdvancedTable'

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
      mode: 'YAML',
      editorContents: '',
      name: '',
      analysisNames: [],
      aggregationResult: '',
      aggregationResultStatus: '',
      aggregationResultError: '',
      transformation: '',
      transformationResult: '',
      saved: true,
      duplicateButtonDisabled: true,
      duplicateDialogOpen: false,
      duplicateErrorText: '',
      manageDialogOpen: false,
      renameButtonDisabled: true,
      renameDialogOpen: false,
      nameToRename: '',
    }
  },

  duplicateDialogOpen() {
    this.setState({duplicateDialogOpen: true})
  },

  duplicateDialogClose() {
    this.setState({duplicateDialogOpen: false})
  },

  manageDialogOpen() {
    this.setState({manageDialogOpen: true})
  },

  manageDialogClose() {
    this.setState({manageDialogOpen: false})
  },

  renameDialogOpen(nameToRename) {
    this.setState({
      nameToRename: nameToRename,
      renameDialogOpen: true,
    })
  },

  renameDialogClose() {
    this.setState({renameDialogOpen: false})
  },

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.aggregation).children[0].focus()
    this.serverRequest = request('GET', `/api/analysis`, (err, result) => {
      if (err) {
        console.log('Error retrieving list of analysis. Replace with some sort of flair or toast.')
      } else {
        this.setState({
          analysisNames: result.body,
          name: result.body[0],
        })
      }
      this.getAnalysis(result.body[0])
    })
  },

  componentWillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.abort()
    }
  },

  // Helpers

  getStyles() {
    return {
      buttons: {
        marginLeft: "5px",
        marginTop: "10px",
      },
      resultBar: {
        color: this.context.muiTheme.rawTheme.palette.textColor,
      },
      dropDown: {
        width: "150px",
        marginRight: 0,
        color: this.context.muiTheme.rawTheme.palette.textColor,
      },
    }
  },

  // Event handlers

  onChangeMode(event) {
    let newMode
    if (this.state.mode === 'JSON') {
      newMode = 'YAML'
    } else if (this.state.mode === 'YAML') {
      newMode = 'JSON'
    }
    this.reformat(undefined, undefined, undefined, undefined, undefined, newMode)
  },

  runAggregation() {
    let body = yaml.safeLoad(this.state.editorContents)
    request('POST', '/api/aggregation', body, (err, result) => {
      if (err) {
        this.setState({
          aggregationResult: err.message,
          aggregationResultStatus: err.status,
        })
      } else {
        let aggregationResult
        if (this.state.mode === 'YAML') {
          aggregationResult = yaml.safeDump(result.body)
        } else {
          aggregationResult = JSON.stringify(result.body, null, 2)
        }
        this.setState({
          aggregationResult: aggregationResult,
          aggregationResultStatus: result.status,
        })
      }
    })
  },

  getSpecToPutOrPost(newName) {
    if (! newName) {
      newName = this.state.name
    }
    let spec = {
      name: newName,
      editorContents: this.state.editorContents,
      aggregationResult: this.state.aggregationResult,
      aggregtionResultError: this.state.aggregationResultError,
      aggregationResultStatus: this.state.aggregationResultStatus,
      transformation: this.state.transformation,
      transformationResult: this.state.transformationResult,
    }
    return spec
  },

  putOrPostAnalysisCallback(err, result) {
    if (err) {
      console.log(err)  // TODO: Replace with flair or toast
      this.setState({
        saved: false,
      })
    } else {
      let newName = result.body.name
      let newAnalysisNames = _.sortBy(_.union(this.state.analysisNames, [newName]))
      this.setState({
        saved: true,
        name: newName,
        analysisNames: newAnalysisNames,
      })
    }
  },

  postAnalysis(newName) {
    let spec = this.getSpecToPutOrPost(newName)
    request('POST', `/api/analysis`, spec, this.putOrPostAnalysisCallback)
  },

  putAnalysis() {
    let spec = this.getSpecToPutOrPost(this.state.name)
    request('PUT', `/api/analysis/${spec.name}`, spec, this.putOrPostAnalysisCallback )
  },

  saveAnalysis() {
    if (! this.state.saved) {
      this.putAnalysis()
    }
  },

  reformat(newEditorContents = this.state.editorContents,
           newTransformation = this.state.transformation,
           newAggregationResult = this.state.aggregationResult,
           newAggregationResultStatus = this.state.aggregationResultStatus,
           newAggregationResultError = this.state.aggregationResultError,
           newMode = this.state.mode,
           newName = this.state.name,
           newTransformationResult = this.state.transformationResult) {
    let aggregationResultAsObject, editorContentsAsObject, transformationResultAsObject
    try {
      editorContentsAsObject = yaml.safeLoad(newEditorContents)
    } catch (e) {}
    if (! editorContentsAsObject) {
      editorContentsAsObject = {}
    }
    try {
      aggregationResultAsObject = yaml.safeLoad(newAggregationResult)
    } catch (e) {}
    if (! aggregationResultAsObject) {
      aggregationResultAsObject = {}
    }
    try {
      transformationResultAsObject = yaml.safeLoad(newTransformationResult)
    } catch (e) {}
    if (! transformationResultAsObject) {
      transformationResultAsObject = {}
    }
    if (newMode === 'YAML') {
      if (editorContentsAsObject) {
        newEditorContents = yaml.safeDump(editorContentsAsObject)
      }
      if (aggregationResultAsObject) {
        newAggregationResult = yaml.safeDump(aggregationResultAsObject)
      }
      if (aggregationResultAsObject) {
        newTransformationResult = yaml.safeDump(transformationResultAsObject)
      }
    } else {
      if (editorContentsAsObject) {
        newEditorContents = JSON.stringify(editorContentsAsObject, null, 2)
      }
      if (aggregationResultAsObject) {
        newAggregationResult = JSON.stringify(aggregationResultAsObject, null, 2)
      }
      if (aggregationResultAsObject) {
        newTransformationResult = JSON.stringify(transformationResultAsObject, null, 2)
      }
    }
    this.setState({
      saved: false,
      editorContents: newEditorContents,
      aggregationResult: newAggregationResult,
      aggregationResultStatus: newAggregationResultStatus,
      aggregationResultError: newAggregationResultError,
      mode: newMode,
      name: newName,
      transformation: newTransformation,
      transformationResult: newTransformationResult,
    })
  },

  onTimeout() {
    this.reformat(this.newValue)
    this.timeout = false
    this.pastePending = false
    delete this.newValue
  },

  onChangeEditorContents(newValue) {
    if (this.pastePending) {  // assumes the onPaste event is called before this onChange handler
      // Below debounces calls to this onChange handler since pastes often result in multiple onChange events
      this.newValue = newValue
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(this.onTimeout, 5)
      } else {
        this.timeout = setTimeout(this.onTimeout, 5)
      }
    } else {
      this.setState({
        editorContents: newValue,
        saved: false,
      })
    }
  },

  onPaste() {
    this.pastePending = true
  },

  onChangeTransformation(newValue) {
    this.setState({
      transformation: newValue,
      saved: false,
    })
  },

  onPasteTransformation() {

  },

  getAnalysis(name) {
    request('GET', `/api/analysis/${name}`, (err, result) => {
      if (err) {
        console.log(err)  // TODO: Replace with flair or toast
      } else {
        let body = JSON.parse(result.body)
        this.reformat(body.editorContents, body.transformation,
          body.aggregationResult, body.aggregationResultStatus, body.aggregationResultError, undefined, name,
          body.transformationResult)
        this.setState({
          saved: true
        })
      }
    })
  },

  deleteAnalysis(name) {
    request('DELETE', `/api/analysis/${name}`, (err, result) => {
      if (err) {
        console.log(err)  // TODO: Replace with flair or toast
      } else {
        let analysisNames = this.state.analysisNames
        _.pull(analysisNames, name)
        if (_.contains(analysisNames, this.state.name)) {
          this.setState({analysisNames})
        } else {
          this.setState({
            analysisNames,
            name: '',
            aggregationResult: '',
            editorContents: '',
          })
        }
      }
    })
  },

  duplicateAnalysis() {
    let newName = _.trim(this.refs.newName.getValue())
    this.postAnalysis(newName)
    this.setState({
      duplicateDialogOpen: false,
      duplicateButtonDisabled: false,
    })
  },

  renameAnalysis() {
    let newName = _.trim(this.refs.renameName.getValue())
    let oldName = this.state.nameToRename
    this.postAnalysis(newName)  // TODO: upgrade post to callback here and use callback to delete old name
    this.deleteAnalysis(oldName)
    this.setState({
      renameDialogOpen: false,
      renameButtonDisabled: false,
      nameToRename: '',
    })
  },

  onDropDownChange(e, index, value) {
    if (value === "+++MANAGE_ANALYSIS+++") {
      this.setState({
        manageDialogOpen: true
      })
    } else {
      this.getAnalysis(value)
    }
  },

  onRenameChange(event) {
    let newName = _.trim(this.refs.renameName.getValue())
    let newRenameButtonDisabled, newRenameErrorText
    if (_.includes(this.state.analysisNames, newName)) {
      newRenameButtonDisabled = true
      newRenameErrorText = 'An analysis by this name already exists'
    } else if (newName.length === 0) {
      newRenameErrorText = 'Required'
      newRenameButtonDisabled = true
    } else {
      newRenameErrorText = ''
      newRenameButtonDisabled = false
    }
    this.setState({
      renameButtonDisabled: newRenameButtonDisabled,
      renameErrorText: newRenameErrorText,
    })
  },

  onNameChange(event) {
    let newName = _.trim(this.refs.newName.getValue())
    let newDuplicateButtonDisabled, newDuplicateErrorText
    if (_.includes(this.state.analysisNames, newName)) {
      newDuplicateButtonDisabled = true
      newDuplicateErrorText = 'An analysis by this name already exists'
    } else if (newName.length === 0) {
      newDuplicateErrorText = 'Required'
      newDuplicateButtonDisabled = true
    } else {
      newDuplicateErrorText = ''
      newDuplicateButtonDisabled = false
    }
    this.setState({
      duplicateButtonDisabled: newDuplicateButtonDisabled,
      duplicateErrorText: newDuplicateErrorText,
    })
  },

  getRowToolbarClass() {
    let RowToolbarClass = React.createClass({
      deleteHandler(event) {
        this.props.parent.deleteAnalysis(this.props.value)
      },
      renameHandler(event) {
        this.props.parent.setState({
          nameToRename: this.props.value,
          renameDialogOpen: true,
        })
      },
      render() {
        return (
          <Toolbar style={{height: 20, backgroundColor: "#FFFFFF"}}>
            <ToolbarGroup>
              <IconButton style={{width: 40, marginRight: 0}} onTouchTap={this.renameHandler}>
                <ActionSettings color="#000000" style={{marginLeft: 0, marginTop: 10, height: 20}}/>
              </IconButton>
              <IconButton style={{width: 50, marginRight: 10}} onTouchTap={this.deleteHandler}>
                <ActionDelete color="#000000" style={{margin: 10, height: 20}}/>
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
        )
      }
    })
    return RowToolbarClass
  },

  render() {
    const duplicateDialogActions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.duplicateDialogClose}
        style={{marginRight: 5}}
      />,
      <RaisedButton
        label="Duplicate"
        primary={true}
        keyboardFocused={false}
        disabled={this.state.duplicateButtonDisabled}
        onTouchTap={this.duplicateAnalysis}
      />,
    ]
    const renameDialogActions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.renameDialogClose}
        style={{marginRight: 5}}
      />,
      <RaisedButton
        label="Rename"
        primary={true}
        keyboardFocused={false}
        disabled={this.state.renameButtonDisabled}
        onTouchTap={this.renameAnalysis}
      />,
    ]
    const manageDialogActions = [
      <FlatButton
        label="Done"
        primary={true}
        onTouchTap={this.manageDialogClose}
        style={{marginRight: 5}}
      />,
    ]
    let styles = this.getStyles()
    let savedColor, savedTooltip
    if (this.state.saved) {
      savedColor = this.context.muiTheme.rawTheme.palette.accent2Color
      savedTooltip = ""
    } else {
      savedColor = this.context.muiTheme.rawTheme.palette.primary1Color
      savedTooltip = "Save"
    }
    let defaultToggled, mode
    if (this.state.mode === 'JSON') {
      defaultToggled = false
      mode = 'json'
    } else {
      defaultToggled = true
      mode = 'yaml'
    }
    const columns = [
      {field: 'name', label: 'Analysis'},  // use `hidden: true` to define hidden fields that can still be identified with valueField
    ]
    let RowToolbarClass = this.getRowToolbarClass()
    return (
      <Paper zDepth={5}>
        <Toolbar noGutter={true}>
          <IconButton firstChild={true} style={{marginTop: 3, marginLeft: 0, width: 40, float: 'left'}} tooltip="Run" tooltipPosition="top-center" onTouchTap={this.runAggregation}>
            <ActionLaunch />
          </IconButton>
          <ToolbarGroup float="left">
            <Toggle
              labelStyle={{marginRight: 0}}
              label={this.state.mode}
              defaultToggled={defaultToggled}
              onToggle={this.onChangeMode}
              style={{marginTop: 15, marginLeft: 10, width: '80px'}}
              thumbStyle={{backgroundColor: Colors.grey300}} />
          </ToolbarGroup>
          <ToolbarGroup lastChild={true} float="right">
            <DropDownMenu labelStyle={styles.dropDown} style={{marginRight: 0}} value={this.state.name} onChange={this.onDropDownChange}>
              {this.state.analysisNames.map((analysisName, index) => {
                return (<MenuItem key={index} value={analysisName} primaryText={analysisName} />)
              })}
              <Divider />
              <MenuItem key={-1} value={"+++MANAGE_ANALYSIS+++"} primaryText={"Manage analysis..."} />
            </DropDownMenu>
            <IconButton style={{marginTop: 3, marginLeft: 0, marginRight: 0, width: 40, float: 'left'}} tooltip="Duplicate as..." tooltipPosition="top-center" onTouchTap={this.duplicateDialogOpen}>
              <ContentAddCircle />
            </IconButton>
            <IconButton style={{marginTop: 3, marginLeft: 0, marginRight: 20}} tooltip={savedTooltip} tooltipPosition="top-center" onTouchTap={this.saveAnalysis}>
              <ContentSave color={savedColor} />
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <Tabs>
          <Tab label="Aggregation">
            <AceEditor
              ref="aggregation"
              mode={mode}
              value={this.state.editorContents}
              theme="github"
              name="aggregation"
              width="100%"
              showPrintMargin={false}
              editorProps={{$blockScrolling: Infinity}}
              onChange={this.onChangeEditorContents}
              onBlur={this.saveAnalysis}
              onPaste={this.onPaste}
              tabSize={2}/>
            <Toolbar style={styles.resultBar}>
              <ToolbarTitle text={"Result: " + this.state.aggregationResultStatus} />
            </Toolbar>
            <AceEditor
              mode={mode}
              value={this.state.aggregationResult}
              theme="github"
              name="aggregationResult"
              width="100%"
              readOnly={true}
              showPrintMargin={false}
              editorProps={{$blockScrolling: true}}
              tabSize={2} />
            </Tab>
            <Tab label="Transformation">
              <AceEditor
                ref="transformation"
                mode={mode}
                value={this.state.transformation}
                theme="github"
                name="transformation"
                width="100%"
                showPrintMargin={false}
                editorProps={{$blockScrolling: Infinity}}
                onChange={this.onChangeTransformation}
                onBlur={this.saveAnalysis}
                tabSize={2}/>
              <Toolbar style={styles.resultBar}>
                <ToolbarTitle text={"Result:"} />
              </Toolbar>
              <AceEditor
                mode={mode}
                value={this.state.transformationResult}
                theme="github"
                name="transformationResult"
                width="100%"
                readOnly={true}
                showPrintMargin={false}
                editorProps={{$blockScrolling: true}}
                tabSize={2} />
            </Tab>
          </Tabs>
        <Dialog
          title="Duplicate analysis"
          actions={duplicateDialogActions}
          modal={false}
          open={this.state.duplicateDialogOpen}
          onRequestClose={this.duplicateDialogClose}
          contentStyle={{width: 300}}
        >
          <TextField
            hintText="Name for duplicated analysis"
            floatingLabelText="Name"
            defaultValue={this.state.name}
            onChange={this.onNameChange}
            errorText={this.state.duplicateErrorText}
            ref="newName"
          />
        </Dialog>
        <Dialog
          title="Manage analysis"
          actions={manageDialogActions}
          modal={false}
          open={this.state.manageDialogOpen}
          onRequestClose={this.manageDialogClose}
          contentStyle={{width: 500}}
        >
          <AdvancedTable
            columns={columns}
            RowToolbarClass={RowToolbarClass}
            rowToolbarWidth={90}
            valueField="name"
            data={this.state.analysisNames}
            initialSortField="name"
            initialSortAscending={false}
            height="250px"
            parent={this}
            >
          </AdvancedTable>
        </Dialog>
        <Dialog
          title="Rename analysis"
          actions={renameDialogActions}
          modal={false}
          open={this.state.renameDialogOpen}
          onRequestClose={this.renameDialogClose}
          contentStyle={{width: 300}}
        >
          <TextField
            hintText="Name to rename to"
            floatingLabelText="New name"
            defaultValue={this.state.nameToRename}
            onChange={this.onRenameChange}
            errorText={this.state.renameErrorText}
            ref="renameName"
          />
        </Dialog>
      </Paper>
    )
  }
})

