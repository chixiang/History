/**
 * [apiready description]
 * @return {[type]} [description]
 */
var apiready = function() {
    $api.fixIos7Bar($api.dom('header'));

    api.addEventListener({
        name: 'reloadHistory'
    }, function(ret, err) {
        if (ret && ret.value) {
            loadList("refresh");
        }
    });

    var historyListData = [];
    per_page_num = 5;
    v_loaded_recors = per_page_num;
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
        rightBtns: [{
            bgColor: '#EED6B0',
            activeBgColor: '',
            width: 70,
            title: '修改',
            titleSize: 14,
            titleColor: '#655A55',
            icon: '',
            iconWidth: 20
        }, {
            bgColor: '#EED6B0',
            activeBgColor: '',
            width: 70,
            title: '删除',
            titleSize: 14,
            titleColor: '#655A55',
            icon: '',
            iconWidth: 20
        }],
        styles: {
            borderColor: '#EED6B0',
            item: {
                bgColor: '#F7F3EA',
                activeBgColor: '#F5F5F5',
                height: 80,
                imgWidth: 40,
                imgHeight: 40,
                imgCorner: 4,
                placeholderImg: '',
                titleSize: 24.0,
                titleColor: '#655A55',
                subTitleSize: 16.0,
                subTitleColor: '#E1D7CA',
                remarkColor: '#655A55',
                remarkSize: 14,
                remarkIconWidth: 30
            }
        },
        data: historyListData
            // fixedOn: api.frameName,
    }, function(ret, err) {
        if (ret.eventType == "show") {
            loadList("refresh");
        }
        if (ret.eventType == "clickContent") {
            historyList.getDataByIndex({
                index: ret.index
            }, function(ret, err) {
                displayHis(ret.data);
            });
        }
        if (ret.eventType == "clickRightBtn" && ret.btnIndex == "0") {
            historyList.getDataByIndex({
                index: ret.index
            }, function(ret, err) {
                modiHis(ret.data);
            });
        }
        if (ret.eventType == "clickRightBtn" && ret.btnIndex == "1") {
            if (confirm("确定删除？")) {
                historyList.getDataByIndex({
                    index: ret.index
                }, function(ret, err) {
                    delHis(ret.data.uid);
                    loadList();
                });
            }
        }
    });
    historyList.setRefreshHeader({
            bgColor: "#f5f5f5"
                // loadingImg: "image/bottombtn0301.png"
        },
        function(ret, err) {
            loadList();
        });

    historyList.setRefreshFooter({
            bgColor: "#f5f5f5"
                // loadingImg: "image/bottombtn0301.png"
        },
        function(ret, err) {
            loadList("append");
        });

}

/**
 * [loadList 加载病历列表]
 * @param  {[type]} type [refresh: 刷新, append: 追加]
 * @return {[type]}      [description]
 */
function loadList(type) {
    var userName = "me";
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
            query.whereEqual({
                qid: queryId1,
                column: 'record_doctor',
                value: userName
            });
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
                                caseHistory_id: ret[idx].id,
                                patient_id: ret[idx].patient_id,
                                record_date: ret[idx].record_date,
                                consultation_department: ret[idx].consultation_department,
                                chief_complaint: ret[idx].chief_complaint,
                                physical_id: ret[idx].physical_id,
                                accessory_exam_id: ret[idx].accessory_exam_id,
                                diagnosis: ret[idx].diagnosis,
                                treatment: ret[idx].treatment,
                                follow_up_id: ret[idx].follow_up_id,
                                record_doctor: ret[idx].record_doctor,
                                patient_pointer: ret[idx].patient_pointer.id,
                                name: ret[idx].patient_pointer.name,
                                gender: ret[idx].patient_pointer.gender,
                                birthday: ret[idx].patient_pointer.birthday,
                                age: ret[idx].patient_pointer.age,
                                admission_number: ret[idx].patient_pointer.admission_number,
                                outpatient_number: ret[idx].patient_pointer.outpatient_number,
                                phone: ret[idx].patient_pointer.phone,
                                address: ret[idx].patient_pointer.address,
                                job: ret[idx].patient_pointer.job,
                                // 给UIListView展示字段赋值
                                title: ret[idx].patient_pointer.name + "   " + (ret[idx].patient_pointer.gender?"男":"女") + "   " + ret[idx].patient_pointer.age + "岁",
                                subTitle: ret[idx].diagnosis,
                                remark: ret[idx].record_date
                            };
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
            api.toast({
                msg: "刷新病历成功"
            });
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
                    api.toast({
                        msg: '到底了~~~别再拉了~~~'
                    });
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
        reload: true,
        bounces: false
    });
}

/**
 * [displayHis description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function displayHis(data) {
    api.openWin({
        name: "history",
        url: './html/history.html',
        pageParam: data,
        reload: true,
        bounces: false
    });
}

/**
 * [modiHis description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function modiHis(data) {
    api.openWin({
        name: "history",
        url: './html/modihis.html',
        pageParam: data,
        reload: true,
        bounces: false
    });
}

/**
 * [modiHis description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function delHis(id) {
    model.deleteById({
            class: 'history',
            id: id
        },
        function(ret, err) {
            if (ret) {
                alert("删除病历成功！");
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
        // if( ret ){
        //      alert( JSON.stringify( ret ) );
        // }else{
        //      alert( JSON.stringify( err ) );
        // }
    });
}
