import React, {Component} from 'react';
import classnames from "classnames"

export class MultipleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",

        }
    }

    handleDeleteItem = item => {
        let {onChange, values, deleteFilterFunc} = this.props;
        onChange(values.filter(each => deleteFilterFunc(each, item)));
    };

    handleAddItem = item => {
        let {onChange, values} = this.props;
        onChange(values.concat(item))
    };

    render() {
        let {keyword} = this.state;
        let {displayTagAs = (each, index) => "Item " + (index + 1), displayAs = () => "displayAs function is not defined yet!", values, list, filterFunc, listKey = (each, index) => index, tagKey = (each, index) => index, emptyNotify = () => "Không có kết quả tương ứng", isPicked = (each, index) => false} = this.props;
        let filterList = filterFunc(list, keyword);
        return (
            <div className="multiple-select">
                <div className="tags-container">
                    {values.map((each, index) => (
                        <div className={classnames("tag")}
                             key={tagKey(each, index)}
                        >
                            {displayTagAs(each, index)}
                            <i className="fal fa-times" onClick={(e) => {
                                e.stopPropagation();
                                this.handleDeleteItem(each, index);
                            }}></i>
                        </div>
                    ))}
                    <input className="rest-input"
                           onChange={e => this.setState({keyword: e.target.value})}
                    />
                </div>
                <div className="search-result">
                    <div className="result-summary">
                        <span className="value">{filterList.length}</span><span>Kết quả</span>
                    </div>
                    {filterList.length ? filterList.map((each, index) => (
                        <div className={classnames("result-item", {picked: isPicked(each, index)})}
                             key={listKey(each, index)}
                             onClick={(e) => {
                                 e.stopPropagation();
                                 if (!isPicked(each)) {
                                     this.handleAddItem(each, index);
                                 }

                             }}
                        >
                            {displayAs(each, index)}
                        </div>
                    )) : <div className="empty-notify">
                        {emptyNotify()}
                    </div>}
                </div>
            </div>
        );
    }
}
