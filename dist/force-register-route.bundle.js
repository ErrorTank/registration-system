(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{967:function(e,t,n){"use strict";n.r(t);var a=n(8),r=n.n(a),i=n(9),c=n.n(i),s=n(10),o=n.n(s),u=n(11),l=n.n(u),d=n(28),f=n.n(d),m=n(12),p=n.n(m),g=n(21),h=n.n(g),v=n(0),y=n.n(v),k=n(624),S=n(180),b=n(625),E=n(247),O=n(623),j=n(82),w=n.n(j),N=n(37),C=n.n(N),D=function(e){function t(e){var n;return r()(this,t),n=o()(this,l()(t).call(this,e)),h()(f()(n),"cancelClickOutside",null),h()(f()(n),"clickOutside",(function(){return n.clickFunc=function(e){var t=w.a.findDOMNode(f()(n));t&&t.contains(e.target)||n.props.onClickOut(e)},window.addEventListener("click",n.clickFunc),window.addEventListener("touchstart",n.clickFunc),function(){window.removeEventListener("click",n.clickFunc),window.removeEventListener("touchstart",n.clickFunc)}})),n.onUnmount((function(){n.cancelClickOutside&&(n.cancelClickOutside(),n.cancelClickOutside=null)})),n}return p()(t,e),c()(t,[{key:"componentDidMount",value:function(){this.cancelClickOutside=this.clickOutside()}},{key:"render",value:function(){return y.a.Children.only(this.props.children)}}]),t}(S.a),L=n(607),F=n.n(L),P=function(e){function t(e){var n;return r()(this,t),n=o()(this,l()(t).call(this,e)),h()(f()(n),"handleDeleteItem",(function(e){var t=n.props,a=t.onChange,r=t.values,i=t.deleteFilterFunc;a(r.filter((function(t){return i(t,e)})))})),h()(f()(n),"handleAddItem",(function(e){var t=n.props,a=t.onChange,r=t.values;console.log(e),console.log(r),a(r.concat(e))})),n.state={keyword:"",isFocus:!1},n.input=y.a.createRef(),n}return p()(t,e),c()(t,[{key:"render",value:function(){var e=this,t=this.state,n=t.keyword,a=t.isFocus,r=this.props,i=r.displayTagAs,c=void 0===i?function(e,t){return"Item "+(t+1)}:i,s=r.displayAs,o=void 0===s?function(){return"displayAs function is not defined yet!"}:s,u=r.values,l=r.list,d=r.filterFunc,f=r.listKey,m=void 0===f?function(e,t){return t}:f,p=r.tagKey,g=void 0===p?function(e,t){return t}:p,h=r.emptyNotify,v=void 0===h?function(){return"Không có kết quả tương ứng"}:h,k=r.isPicked,S=void 0===k?function(e,t){return!1}:k,b=d(l,n);return console.log(n),y.a.createElement(D,{onClickOut:function(){e.state.isFocus&&e.setState({isFocus:!1})}},y.a.createElement("div",{className:"multiple-select",onClick:function(){e.input.current.focus()}},y.a.createElement("div",{className:"tags-container"},u.map((function(t,n){return y.a.createElement("span",{className:C()("tag"),key:g(t,n)},c(t,n),y.a.createElement("i",{className:"fal fa-times",onClick:function(a){a.stopPropagation(),e.handleDeleteItem(t,n)}}))})),y.a.createElement(F.a,{className:"rest-input",contentEditable:!0,innerRef:this.input,html:n,onKeyDown:function(t){""===e.state.keyword&&8===t.keyCode&&e.props.onChange(e.props.values.filter((function(t,n){return n!==e.props.values.length-1})))},onChange:function(t){e.setState({keyword:t.target.value})},onFocus:function(){return e.setState({isFocus:!0})}})),a&&y.a.createElement("div",{className:"search-result"},y.a.createElement("div",{className:"result-summary"},y.a.createElement("span",{className:"value"},b.length),y.a.createElement("span",null,"Kết quả")),b.length?b.map((function(t,n){return y.a.createElement("div",{className:C()("result-item",{picked:S(t,n)}),key:m(t,n),onClick:function(a){a.stopPropagation(),console.log(!S(t)),S(t)||e.handleAddItem(t,n)}},o(t,n))})):y.a.createElement("div",{className:"empty-notify"},v()))))}}]),t}(v.Component),_=n(121),I=n.n(_),x=n(666),R=n(16),T=n(655),A=n(667),K=n(94),B=n(628),W=n(627),Y=n(24),G=n(250),q=n.n(G),J=n(630),M=n.n(J),H=n(626),U=(n(668),n(833)),V=n(641),z=n(183),Q=n(669);function X(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function Z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?X(Object(n),!0).forEach((function(t){h()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):X(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var $=function(e){function t(e){var n;return r()(this,t),n=o()(this,l()(t).call(this,e)),h()(f()(n),"updateSubjectLessons",(function(e,t){for(var a=n.state.subjectList,r=0;r<a.length;r++){if(a[r]._id===e._id)return a[r].lessons=t,n.setState({subjectList:a})}})),h()(f()(n),"toggleRegister",(function(e){var t=K.a.syncGet(),a=t.currentYear,r=t.currentSemester,i=n.state.subjectList.find((function(t){return t.lessons.find((function(t){return t.find((function(t){return t._id===e[0]._id}))}))}));return A.a.toggleRegisterLesson(n.state.pickedStudent.info._id,"".concat(a.from,"-").concat(a.to),r,{lesson:e}).then((function(){return Promise.all([n.board.loadData(),V.a.getSubjectInfo(i.lessons,"".concat(a.from,"-").concat(a.to),r).then((function(e){n.updateSubjectLessons(i,e),n.setState({loading:!1})})).catch((function(e){n.setState({error:e,loading:!1})}))])})).catch((function(e){if("full"===e.message)return z.b.alert({text:y.a.createElement(Q.a,{strongText:"Thông báo:",type:"border",color:"danger",content:y.a.createElement(y.a.Fragment,null,y.a.createElement("span",{className:"pl-3"},"Bạn không thể đăng ký ",y.a.createElement("strong",null,e.extra.name)," do lớp đã đầy"))}),title:"Lỗi đăng ký",btnText:"Đồng ý"})}))})),h()(f()(n),"onRegister",(function(e){var t=n.state,a=t.schedule,r=t.pickedSubject,i=t.subjectList;if(!a)return n.toggleRegister(e);var c=i.find((function(e){return e._id===r})).lessons.reduce((function(e,t){return e.concat(t.map((function(e){return e._id})))}),[]),s=a.list.map((function(e){return e._id})),o=null;return s.find((function(e){return!!c.includes(e)}))||!a.list.find((function(t){return!!e.find((function(e){return!(e.dayOfWeek!==t.dayOfWeek||e.from.name>t.to.name||e.to.name<t.from.name)&&(o={newItem:e,existed:t},!0)}))}))?n.toggleRegister(e):(console.log(o),z.b.alert({text:y.a.createElement(Q.a,{strongText:"Thông báo:",type:"border",color:"danger",content:y.a.createElement(y.a.Fragment,null,y.a.createElement("span",{className:"pl-3"},"Bạn không thể đăng ký ",y.a.createElement("strong",null,o.newItem.name)," do trùng vào ",y.a.createElement("strong",null,o.existed.dayOfWeek<7?"Thứ "+(o.existed.dayOfWeek+1):"Chủ nhật")," ",y.a.createElement("strong",null,"Ca ",o.existed.from.name,"-",o.existed.to.name)," của ",y.a.createElement("strong",null,o.existed.class.name)))}),title:"Lỗi đăng ký",btnText:"Đồng ý"}))})),h()(f()(n),"loadData",(function(){return V.a.getSubjectListForForceRegistration(n.state.pickedStudent)})),h()(f()(n),"onClickScheduleItem",(function(e,t){var a=t.setLoading,r=R.a.getState().info;if(console.log(r.division),console.log(e),r.division?e.class.subject.division===r.division._id:"pdt"===R.a.getState().role){a();var i=!0,c=!1,s=void 0;try{for(var o,u=n.state.subjectList[Symbol.iterator]();!(i=(o=u.next()).done);i=!0){var l=o.value.lessons.find((function(t){return!!t.find((function(t){return t._id===e._id}))}));if(l)return n.toggleRegister(l)}}catch(e){c=!0,s=e}finally{try{i||null==u.return||u.return()}finally{if(c)throw s}}}})),h()(f()(n),"refreshScheduleBoard",q()((function(e){n.setState({pickedStudent:e.pickedStudents[0],pickedStudents:e.pickedStudents},(function(){n.board.loadData()}))}),1500)),h()(f()(n),"displayInsScheduleItem",(function(e){return y.a.createElement("div",{className:"common-inner-task"},y.a.createElement("div",{className:"class-name"},e.class.name),y.a.createElement("div",{className:"class-room-name"},e.classRoom.name))})),n.state={loading:!0,pickedStudent:e.pickedStudents[0],pickedStudents:e.pickedStudents,pickedSubject:null,schedule:null,list:[],subjectList:[]},n.loadData().then((function(e){n.setState(Z({},e,{loading:!1}))})).catch((function(e){n.setState({error:e,loading:!1})})),n}return p()(t,e),c()(t,[{key:"componentWillReceiveProps",value:function(e){M()(e.pickedStudents,this.props.pickedStudents)||this.refreshScheduleBoard(e)}},{key:"render",value:function(){var e=this,t=this.state,n=t.pickedStudent,a=t.pickedStudents,r=t.pickedSubject,i=t.subjectList,c=t.loading,s=i.find((function(e){return e._id===r})),o=K.a.syncGet(),u=o.currentYear,l=o.currentSemester;console.log(n);return y.a.createElement("div",{className:"force-schedule-board"},y.a.createElement("div",{className:"student-select"},y.a.createElement("span",{className:"label"},"Sinh viên đang chọn"),y.a.createElement(H.a,{options:a,value:n,displayAs:function(e){return e.name+" (".concat(e.identityID,")")},getValue:function(e){return e._id},onChange:function(t){e.setState({pickedStudent:a.find((function(e){return e._id===t.target.value})),loading:!0,pickedSubject:null},(function(){e.board.loadData(),e.loadData().then((function(t){return e.setState(Z({},t,{loading:!1}))}))}))}})),y.a.createElement("div",{className:"content-wrapper-hehe"},y.a.createElement("div",{className:"subject-list"},c?y.a.createElement(O.a,null):y.a.createElement(y.a.Fragment,null,y.a.createElement("div",{className:"small-title"},"Danh sách môn đăng ký"),y.a.createElement(U.a,{pickedSubject:r,subjectList:i,schedule:this.state.schedule,subject:s,onRegister:this.onRegister,toggleRegister:this.toggleRegister,onChange:function(t){return e.setState({pickedSubject:t})}}))),y.a.createElement(x.a,{schoolYear:n.info.schoolYear,schedule:this.state.schedule,label:"Học phí kì này"}),y.a.createElement(T.a,{filter:{semester:B.a.find((function(e){return e.value===l})),year:W.a.find((function(e){return e.value===Object(Y.d)(u)}))},ref:function(t){return e.board=t},className:"ins-schedule-board",api:function(){var t,a,r,i,c,s;return I.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return t=K.a.syncGet(),a=t.currentYear,r=t.currentSemester,i={year:W.a.find((function(e){return e.value===Object(Y.d)(a)})),semester:B.a.find((function(e){return e.value===r}))},c=i.year,s=i.semester,o.abrupt("return",A.a.getStudentSchedule(n.info._id,c.value,s.value).then((function(t){return e.setState({schedule:t}),t||{list:[]}})));case 3:case"end":return o.stop()}}))},displayItem:this.displayInsScheduleItem,onClickItem:this.onClickScheduleItem,getDayOfWeek:function(e){return e.dayOfWeek},getShiftStart:function(e){return e.from.name},getShiftEnd:function(e){return e.to.name},showSuggestion:!0})))}}]),t}(v.Component);function ee(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}n.d(t,"default",(function(){return te}));var te=function(e){function t(e){var n;return r()(this,t),n=o()(this,l()(t).call(this,e)),h()(f()(n),"filterStudents",(function(e,t){return e.filter((function(e){return e.identityID.toLowerCase().includes(t.trim().toLowerCase())||e.name.toLowerCase().includes(t.trim().toLowerCase())}))})),h()(f()(n),"handleChangeStudents",(function(e){n.setState({pickedStudents:e})})),n.initData={pickedStudents:[],students:[],loadStudents:!0},n.state=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ee(Object(n),!0).forEach((function(t){h()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ee(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},n.initData),E.a.getBriefStudents().then((function(e){return n.setState({students:e,loadStudents:!1})})),n}return p()(t,e),c()(t,[{key:"render",value:function(){var e=this.state,t=e.students,n=e.loadStudents,a=e.pickedStudents;return y.a.createElement(k.a,{title:"Ép cứng"},y.a.createElement(b.a,{title:"Ép cứng môn học"},y.a.createElement("div",{className:"force-register-route"},y.a.createElement("div",{className:"common-route-wrapper"},n&&y.a.createElement(O.a,null),y.a.createElement("div",{className:"force-step"},y.a.createElement("div",{className:"step-title"},y.a.createElement("span",{className:"strong"},"Bước 1:"),"Chọn sinh viên ép cứng"),y.a.createElement("div",{className:"step-body"},y.a.createElement("div",{className:"select-wrapper"},y.a.createElement(P,{values:a,list:t,displayTagAs:function(e,t){return e.identityID},displayAs:function(e,t){return e.name+" (".concat(e.identityID,")")},filterFunc:this.filterStudents,onChange:this.handleChangeStudents,listKey:function(e){return e._id},tagKey:function(e){return e._id},emptyNotify:function(){return"Không tìm thấy sinh viên nào"},isPicked:function(e){return a.find((function(t){return t._id===e._id}))},deleteFilterFunc:function(e,t){return e._id!==t._id}})))),!!a.length&&y.a.createElement("div",{className:"force-step"},y.a.createElement("div",{className:"step-title"},y.a.createElement("span",{className:"strong"},"Bước 2:"),"Ép cứng cho ",y.a.createElement("span",{className:"hi-light"},a.length," "),"sinh viên"),y.a.createElement("div",{className:"step-body"},y.a.createElement($,{pickedStudents:a})))))))}}]),t}(S.a)}}]);