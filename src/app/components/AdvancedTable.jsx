import _ from 'lodash'

import React from 'react'

import {Mixins, IconButton} from 'material-ui'
const {StylePropable, StyleResizable} = Mixins
import {Table, TableHeaderColumn, TableRow, TableHeader, TableRowColumn, TableBody, TableFooter} from 'material-ui'
import {NavigationArrowDropDown, NavigationArrowDropUp} from 'material-ui/lib/svg-icons'

export default React.createClass({

  propTypes: {
    onChangeMuiTheme: React.PropTypes.func,
    columns: React.PropTypes.array,
    data: React.PropTypes.array,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [StylePropable, StyleResizable],

  onHeaderTouch(event) {
    let label = event.target.textContent
    let touchedColumn
    if (_.isString(label)) {
      let oldSortField = this.state.sort.field
      let oldSortAscending = this.state.sort.ascending
      for (let column of this.props.columns) {
        if (label === column.label || label===column.tooltip + column.label) {
          touchedColumn = column
          break
        }
      }
      if (touchedColumn) {
        let newSortField, newSortAscending
        if (touchedColumn.field === oldSortField) {
          newSortField = oldSortField
          newSortAscending = ! oldSortAscending
          let sortedData = this.state.sortedData
          sortedData.reverse()
          this.setState({
            sortedData
          })
        } else {
          newSortField = touchedColumn.field
          newSortAscending = true
          let sortedData = _.sortBy(this.state.sortedData, newSortField)
          if (newSortAscending) {
            sortedData.reverse()
          }
          this.setState({
            sortedData
          })
        }
        this.setState({
          sort: {
            field: newSortField,
            ascending: newSortAscending,
          }
        })


      }
    }
  },

  getInitialState() {
    let sort = {
      field: this.props.columns[0].field,
      ascending: true,
    }
    let sortedData = _.sortBy(this.props.data, sort.field)
    if (sort.ascending) {
      sortedData.reverse()
    }
    return {sort, sortedData}
  },

  componentWillReceiveProps(nextProps) {
    let sortedData = _.sortBy(nextProps.data, this.state.sort.field)
    if (this.state.sort.ascending) {
      sortedData.reverse()
    }
    this.setState({
      sortedData
    })
  },

  render() {
    let columns = this.props.columns
    return (
      <Table
        fixedHeader={true}
        fixedFooter={false}
        selectable={true}
        multiSelectable={true}
        onRowSelection={this._onRowSelection}
      >
        <TableHeader enableSelectAll={true}>
          <TableRow key={0} style={{color: "#000000"}}>
            {columns.map((field, index) => {
              let sortIcon
              if (field.field === this.state.sort.field) {
                if (this.state.sort.ascending) {
                  sortIcon = <NavigationArrowDropDown viewBox="0 0 17 17" />
                } else {
                  sortIcon = <NavigationArrowDropUp viewBox="0 0 17 17" />
                }
              }
              return (
                <TableHeaderColumn onTouchTap={this.onHeaderTouch} key={index} style={{fontSize: "16"}} tooltip={field.tooltip}>
                  <div style={{height: "50px", lineHeight: "50px"}}>{field.label}{sortIcon}</div>
                </TableHeaderColumn>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody
          showRowHover={false}
          stripedRows={true}
          displayRowCheckbox={true}
          style={{backgroundColor: '#FFFFFF', color: "#AAAAAA"}}
        >
          {this.state.sortedData.map( (detailRow, index) => {
            return (
              <TableRow key={index} selected={detailRow.selected} style={{color: "#000000"}}>
                {columns.map((field, index) => {
                  return (
                    <TableRowColumn key={field.field}>{detailRow[field.field]}</TableRowColumn>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

})