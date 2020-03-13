import React from "react";
import isEqual from "lodash/isEqual"
import {Pagination} from "./pagination/pagination";
import classnames from "classnames"
import isEmpty from "lodash/isEmpty";
import {customHistory} from "../../routes/routes";
import {LoadingInline} from "../loading-inline/loading-inline";
import {wait} from "../../../common/utils/common";
import io from "socket.io-client";
import {Tooltip} from "../tooltip/tooltip";

export class CommonDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,

        };


    };


    pageSize() {
        const {maxItem = 10} = this.props;
        return maxItem;
    }

    clickRow = (e, row) => {
        let {rowLinkTo, onClickRow} = this.props;
        if (rowLinkTo) {
            customHistory.push(rowLinkTo(e, row));
        } else if (onClickRow) {
            onClickRow(e, row);
        }
    };

    render() {
        let {columns, className, rowTrackBy = (row, i) => i, onClickRow, rowLinkTo, rowClassName, emptyNotify = "Empty table.", totalText, onMouseEnterRow, onMouseLeaveRow, list = null, loading = false} = this.props;

        return (
            <div className="common-data-table">
                {list && totalText && (
                    <div className="summary">
                        {totalText(list.length)}
                    </div>
                )}
                {list != null && (
                    <table className={classnames("data-table", className)}>
                        <thead>
                        <tr>
                            {columns.map(this.renderHeaderCell)}
                        </tr>
                        </thead>
                        <tbody>
                        {!loading && (isEmpty(list) ? (
                            <tr>
                                <td className="no-data" colSpan={columns.length}>{emptyNotify}</td>
                            </tr>
                        ) : list.map((row, rIndex) => (
                            <tr
                                key={rowTrackBy(row, rIndex)}
                                onClick={(onClickRow == null && rowLinkTo == null) ? () => null : e => this.clickRow(e, row)}
                                className={classnames({clickable: onClickRow != null || rowLinkTo != null}, rowClassName)}
                                onMouseEnter={() => {
                                    if(onMouseEnterRow){
                                        onMouseEnterRow(row, rIndex);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if(onMouseLeaveRow){
                                        onMouseLeaveRow(row, rIndex);
                                    }
                                }}
                            >
                                {columns.map(({cellClass, checkBoxCell = false, cellDisplay, show = () => true, condition = () => true}, index) => {
                                    return (show({data: list}) && condition()) ? (
                                        <td key={index}
                                            className={classnames(cellClass, {"checkbox-cell": checkBoxCell})}>

                                            {cellDisplay ? cellDisplay(row, rIndex) : null}
                                        </td>
                                    ) : null;
                                })}


                            </tr>


                        )))}
                        </tbody>
                    </table>
                )}
                {loading && (
                    <LoadingInline className={"table-loading"}/>
                )}



            </div>
        );
    }

    renderHeaderCell = (column, index) => {
        let {label, sortable = false, sortKey, cellClass, customHeader = null, show = () => true, checkBoxCell = false, condition = () => true, list} = column;
        if (!show({list})) {
            return null;
        }
        let renderHeader = () => customHeader ? customHeader(list) : label;
        if (!sortable) {
            if (condition())
                return (
                    <th className={classnames(cellClass, {"checkbox-cell": checkBoxCell})} key={index}>
                        {renderHeader()}
                    </th>
                );
            return null;
        }


    };
}
