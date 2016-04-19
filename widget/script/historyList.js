/**
 * [apiready description]
 * @return {[type]} [description]
 */
var apiready = function() {
    userName = $api.getStorage("userName");

    // 接收刷新列表event
    api.addEventListener({
        name: 'historyAddEvent'
    }, function(ret, err) {
        if (ret) {
            loadList("refresh");
        }
    });
    api.addEventListener({
        name: 'historyModiEvent'
    }, function(ret, err) {
        if (ret) {
            loadList("refresh");
        }
    });

    // 测试发现ios初始列表数组为空的话不加载UIListView，所以初始先一个空列表
    var historyListData = [{
        title: '',
        subTitle: '',
        remark: ''
    }];

    // 每页数据设置为10条
    per_page_num = 10;
    // 已加载的条数，设置初始为0，打开页面时判断如果为0则进行第一次加载
    v_loaded_recors = 0;

    model = api.require('model');
    query = api.require('query');
    model.config({
        appId: 'A6903478274381',
        appKey: '460A4799-0424-A29B-6809-F06FDF1D888F',
        host: 'https://d.apicloud.com'
    });
    historyList = api.require('UIListView');
    historyList.open({
        rect: {
            x: 0,
            y: $api.dom('header').offsetHeight,
            w: api.winWidth,
            h: $api.dom('#main').offsetHeight
        },
        data: historyListData,
        rightBtns: [{
            bgColor: '#B3A689',
            activeBgColor: '',
            width: 70,
            title: '修改',
            titleSize: 14,
            titleColor: '#655A55',
            icon: '',
            iconWidth: 20
        }, {
            bgColor: '#B3A689',
            activeBgColor: '',
            width: 70,
            title: '删除',
            titleSize: 14,
            titleColor: '#655A55',
            icon: '',
            iconWidth: 20
        }],
        styles: {
            borderColor: '#B3A689',
            item: {
                bgColor: '#F7F3EA',
                activeBgColor: '#B3A689',
                height: 80,
                imgWidth: 40,
                imgHeight: 40,
                imgCorner: 4,
                placeholderImg: '',
                titleSize: 20,
                titleColor: '#655A55',
                subTitleSize: 14.0,
                subTitleColor: '#E1D7CA',
                remarkColor: '#655A55',
                remarkSize: 14,
                remarkIconWidth: 30
            }
        },
        fixedOn: api.frameName
    }, function(ret, err) {
        // 发现有时第一次打开不加载，所以设置了v_loaded_recors初始值为0，判断如果为0则进行一次加载
        if (v_loaded_recors == 0 || ret.eventType == "show") {
            loadList("refresh");
        }

        // 点击列表事件
        if (ret.eventType == "clickContent") {
            historyList.getDataByIndex({
                index: ret.index
            }, function(ret, err) {
                viewHistory(ret.data.id);
            });
        }

        // 左划第一个按钮事件，修改病历
        if (ret.eventType == "clickRightBtn" && ret.btnIndex == "0") {
            historyList.getDataByIndex({
                index: ret.index
            }, function(ret, err) {
                modiHistory(ret.data.id);
            });
        }

        // 左划第二个按钮事件，删除病历
        if (ret.eventType == "clickRightBtn" && ret.btnIndex == "1") {
            if (confirm("确定删除？")) {
                historyList.getDataByIndex({
                    index: ret.index
                }, function(ret, err) {
                    deleteHistory(ret.data.id);
                });
            }
        }
    });
    historyList.setRefreshHeader({
            bgColor: "#f5f5f5"
        },
        function(ret, err) {
            loadList();
        });

    historyList.setRefreshFooter({
            bgColor: "#f5f5f5"
        },
        function(ret, err) {
            loadList("append");
        });

    var backSecond = 0;
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        var curSecond = new Date().getSeconds();
        if (Math.abs(curSecond - backSecond) > 2) {
            backSecond = curSecond;
            api.toast({
                msg: '再按一次关闭应用',
                duration: 2000,
                location: 'bottom'
            });
        } else {
            // 绑定安卓的后退按钮事件 两秒内后退按钮点击两次 退到后台运行
            // var rb = api.require('runBackground');
            // rb.hideActivity();
            api.closeWidget({
                id: 'A6903478274381',
                retData: {
                    name: 'closeWidget'
                },
                animation: {
                    type: 'flip',
                    subType: 'from_bottom',
                    duration: 300
                }
            });
        }
    });

}

/**
 * [loadList 加载病历列表]
 * @param  {[type]} type [refresh: 刷新, append: 追加]
 * @return {[type]}      [description]
 */
function loadList(type) {
    showProgress("正在加载病历...");
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId1 = ret.qid;
            query.limit({
                qid: queryId1,
                value: per_page_num
            });
            if (type == "append") {
                query.skip({
                    qid: queryId1,
                    value: v_loaded_recors
                });
            }
            query.desc({
                qid: queryId1,
                column: "updatedAt"
            });
            query.include({
                qid: ret.qid,
                column: 'patient_pointer'
            });
            if (userName != "admin") {
                query.whereEqual({
                    qid: queryId1,
                    column: 'record_doctor',
                    value: userName
                });
            }
            var json_objs = [];
            model.findAll({
                class: "caseHistory",
                qid: queryId1
            }, function(ret, err) {
                if (err) {
                    alert(JSON.stringify(err));
                } else {
                    if (ret) {
                        var idx = 0;
                        while (ret[idx] != undefined) {
                            var historyItem = {
                                id: ret[idx].id,
                                patient_id: ret[idx].patient_id,
                                record_date: ret[idx].record_date,
                                consultation_department: ret[idx].consultation_department,
                                chief_complaint: ret[idx].chief_complaint,
                                accessory_exam_id: ret[idx].accessory_exam_id,
                                diagnosis: ret[idx].diagnosis,
                                treatment: ret[idx].treatment,
                                follow_up: ret[idx].follow_up,
                                record_doctor: ret[idx].record_doctor,
                                patient_pointer: ret[idx].patient_pointer,
                                physical_pointer: ret[idx].physical_pointer,
                                title: ret[idx].patient_pointer.name + "   " + ret[idx].diagnosis,
                                subTitle: ret[idx].patient_pointer.gender + " - " + ret[idx].patient_pointer.age + "岁 - " + ret[idx].consultation_department + " - " + ret[idx].record_date,
                                remark: (ret[idx].patient_pointer.admission_number != "") ? (ret[idx].patient_pointer.admission_number + "(住)") : (ret[idx].patient_pointer.outpatient_number)
                            };
                            if (userName == "admin") {
                                historyItem.subTitle = "记录: " + historyItem.record_doctor + " - " + historyItem.subTitle;
                            }
                            json_objs.push(historyItem);
                            idx = idx + 1;
                        }

                        if (type == "append") {
                            appendData(json_objs);
                        } else {
                            loadData(json_objs);
                        }

                    }
                }
                api.hideProgress();
            });
        }
    });
}

/**
 * [loadData description]
 * @param  {[type]} json_objs [description]
 * @return {[type]}           [description]
 */
function loadData(json_objs) {
    historyList.reloadData({
        "data": json_objs
    }, function(ret, err) {
        if (ret.status) {
            // api.toast({
            //     msg: "刷新病历成功"
            // });
        }
    });
    v_loaded_recors = json_objs.length;
}

/**
 * [appendData description]
 * @param  {[type]} json_objs [description]
 * @return {[type]}           [description]
 */
function appendData(json_objs) {
    historyList.appendData({
            "data": json_objs
        },
        function(ret) {
            if (ret.status) {
                if (json_objs.length != per_page_num) {
                    // api.toast({
                    //     msg: '别再拉了~~~到底了~~~'
                    // });
                }
                v_loaded_recors = v_loaded_recors + json_objs.length;
            }
        });
}

/**
 * [openWin description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
function openWin(type) {
    api.openWin({
        name: type,
        url: './html/' + type + '.html',
        pageParam: {},
        animation: {
            type: "movein",
            subType: "from_right",
            duration: 300
        },
        reload: false,
        bounces: false
    });
}

/**
 * [displayHis description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function viewHistory(history_id) {
    api.openWin({
        name: "history",
        url: './html/viewFullHistory.html',
        pageParam: {
            history_id: history_id
        },
        reload: false,
        bounces: false
    });
}

/**
 * [modiHistory description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function modiHistory(history_id) {
    api.openWin({
        name: "modiHistory",
        url: './html/history.html',
        pageParam: {
            history_id: history_id,
            type: "modi"
        },
        reload: false,
        bounces: false
    });
}

/**
 * [deleleHis description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function deleteHistory(id) {
    model.deleteById({
            class: 'caseHistory',
            id: id
        },
        function(ret, err) {
            if (ret) {
                // 删除病历后刷新列表
                // alert("删除病历成功！");
                api.toast({
                    msg: "删除病历成功"
                })
                loadList();
            } else {
                alert("删除病历失败！");
            }
        });
}

/**
 * [openSearch description]
 * @return {[type]} [description]
 */
function openSearch() {
    var UISearchBar = api.require('UISearchBar');
    UISearchBar.open({
        placeholder: '请输入病历关键字',
        historyCount: 10,
        showRecordBtn: true,
        texts: {
            cancelText: '取消',
            clearText: '清除搜索记录'
        },
        styles: {
            navBar: {
                bgColor: '#FFFFFF',
                borderColor: '#ccc'
            },
            searchBox: {
                bgImg: '',
                color: '#000',
                height: 44
            },
            cancel: {
                bg: 'rgba(0,0,0,0)',
                color: '#D2691E',
                size: 16
            },
            list: {
                color: '#696969',
                bgColor: '#FFFFFF',
                borderColor: '#eee',
                size: 16
            },
            clear: {
                color: '#000000',
                borderColor: '#ccc',
                size: 16
            }
        }
    }, function(ret, err) {
        api.toast({
            msg: ret,
            duration: 2000,
            location: "top"
        });
    });
}

function logout() {
    if (confirm("是否确定退出？")) {

        $api.setStorage("userName", "");
        api.closeToWin({
            name: 'root',
            animation: {
                type: 'flip',
                subType: 'from_bottom',
                duration: 500
            }
        });
    }
}
