import React, {Component} from 'react';

export class SubjectClassForm extends Component {
    constructor(props) {
        super(props);
        props.form.validateData();
    }

    render() {
        let classes = this.props.form.getPathData("classes");
        return (
            <div className="subject-class-form common-form">
                <div className="form-title">
                    Thông tin lớp học phần
                </div>
                <div className="classes-container">
                    {classes.length ? (
                        <div className="classes-table">

                        </div>
                    ) : (
                        <div className="empty-alert">
                            <p>Một học phần bắt buộc có ít nhất một lớp học phần</p>
                            <button className="btn"><i className="fal fa-plus"></i> Tạo lớp học phần đầu tiên</button>
                        </div>
                    )

                    }
                </div>
            </div>
        );
    }
}

