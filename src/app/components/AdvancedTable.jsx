import _ from 'lodash'

import React from 'react'

import {Mixins} from 'material-ui'
const {StylePropable, StyleResizable} = Mixins
import {Table, TableHeaderColumn, TableRow, TableHeader, TableRowColumn, TableBody, TableFooter} from 'material-ui'

export default React.createClass({

  propTypes: {
    onChangeMuiTheme: React.PropTypes.func,
    columns: React.PropTypes.array,
    rows: React.PropTypes.array,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  mixins: [StylePropable, StyleResizable],

  onHeaderTouch(event) {
    let label = event.target.textContent
    let touchedColumn
    if (_.isString(label)) {
      for (let column of this.props.columns) {
        if (label === column.label || label===column.tooltip + column.label) {
          touchedColumn = column
          break
        }
      }
      console.log(touchedColumn)

    }
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
              return (
                <TableHeaderColumn onTouchTap={this.onHeaderTouch} key={index} style={{fontSize: "16"}} tooltip={field.tooltip}>
                  {field.label}
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
          {this.props.data.map( (detailRow, index) => {
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