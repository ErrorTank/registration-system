import React from "react";
import {Avatar} from "../../../../common/avatar/avatar";
import {userInfo} from "../../../../../common/states/common";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {customHistory} from "../../../../routes/routes";
import classnames from "classnames"

export class UserSection extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isDropdown: true
        };
    };

    styles = {

        largeIcon: {
            width: 60,
            height: 60,
        },

    };

    items = [
        {
            label: "Thông tin cá nhân",
            icon: <PersonOutlineIcon
                    fontSize={"inherit"}
            />,
            url: "/profile"
        },{
            label: "Đăng xuất",
            icon: <ExitToAppIcon fontSize={"inherit"}/>,
            onClick: () => {
                userInfo.setState(null);
                customHistory.push("/login");
            }
        },
    ];

    render(){
        let {isDropdown} = this.state;
        let info = userInfo.getState();
        return(
            <div className="user-section"
                 // onMouseEnter={() => this.setState({isDropdown: true})}
                 // onMouseLeave={() => this.setState({isDropdown: false})}
            >
                <Avatar
                    round={true}
                    name={info.name}
                    size={"small"}
                />
                <span className="full-name">
                    {info.name}
                </span>
                <KeyboardArrowDownIcon/>
                {isDropdown && (
                    <div className="user-dropdown">
                        {this.items.map((item) => (
                            <div className={classnames("dropdown-item")}
                                 onClick={() => {
                                     if(item.url){
                                         customHistory.push(url);
                                     }else{
                                         item.onClick();
                                     }
                                 }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                )

                }

            </div>
        );
    }
}