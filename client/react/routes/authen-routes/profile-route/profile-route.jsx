import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import moment from "moment"
import {userInfo} from "../../../../common/states/common";
import {userApi} from "../../../../api/common/user-api";
import {changePasswordModal} from "../../../common/modal/change-password-modal/change-password-modal";

class ProfileRoute extends Component {
    constructor(props){
        super(props);
        this.state = {
            info: null
        }
        userApi.getUserDetails(userInfo.getState()._id).then(info => this.setState({info}))
    }

    basicInfo  =  [
        {
            label: "Họ và tên",
            render: item => item.name
        } , {
            label: "Ngày sinh",
            render: item => moment(item.dob).format("DD/MM/YYYY")
        }, {
            label: "Số điện thoại",
            render: item => item.phone
        },{
            label: "Email",
            render: item => item.email
        }
    ];

    matcher = {
        "sv": [
            {
                label: "Mã sinh viên",
                render: item => item.identityID,
            },
            ...this.basicInfo,
            {
                label: "Chuyên ngành",
                render: item => item.speciality.name,
            },
            {
                label: "Lớp",
                render: item => `${item.speciality.shortName}${item.schoolYear}${item.englishLevel}`,
            },
            {
                label: "Khóa",
                render: item => item.schoolYear,
            }, {
                label: "Tình trạng",
                render: item => item.active ? "Đang theo học" : "Đã ra trường",
            },
        ],
        "gv": [
            {
                label: "Mã giảng viên",
                render: item => item.identityID,
            },
            ...this.basicInfo,
            {
                label: "Bộ môn",
                render: item => item.division ? item.division.name : "Không xác định",
            },
        ],
        "admin": [
            {
                label: "Mã định danh",
                render: item => item.identityID,
            },
            ...this.basicInfo,
        ], "pdt": [
            {
                label: "Mã định danh",
                render: item => item.identityID,
            },
            ...this.basicInfo,
        ],
    };

    render() {
        let info = userInfo.getState();
        let infoList = this.matcher[info.role];
        return (
            <PageTitle
                title={"Thông tin cá nhân"}
            >
                <AuthenLayoutTitle
                    title={"Thông tin cá nhân"}
                >
                    <div className="profile-route">
                        <div className="common-route-wrapper">
                            <div className="user-info">
                                <div className="info">
                                    {infoList.map((each, i) => (
                                        <div className="info-row" key={each.label}>
                                            <div className="label">
                                                {each.label}
                                            </div>
                                            <div className="value">
                                                {each.render(info)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="action">
                                    <button className="btn btn-next" disabled={!this.state.info} onClick={() => {
                                            changePasswordModal.open({
                                                info: this.state.info
                                            })
                                    }}>Đổi mật khẩu</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}

export default ProfileRoute;