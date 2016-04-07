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
            refreshList();
        }
    })

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
    historyList = api.require('slipList');
    historyList.open({
        x: 0,
        y: $api.dom('header').offsetHeight,
        w: api.winWidth,
        h: $api.dom('#main').offsetHeight,
        leftBtn: [{
            bg: '#EED6B0',
            title: '删除',
            titleSize: 14,
            titleColor: '#655A55'
                // selectedColor: ''
        }],
        leftBg: '',
        rightBtn: [{
            bg: '#EED6B0',
            title: '修改',
            titleSize: 14,
            titleColor: '#655A55'
                // selectedColor: ''
        }],
        rightBg: '',
        itemStyle: {
            borderColor: '#EED6B0',
            bgColor: '#F7F3EA',
            selectedColor: '#F5F5F5',
            height: 100,
            placeholderImg: null,
            titleSize: 10,
            titleColor: '#655A55',
            headlineSize: '10',
            headlineColor: '$655A55',
            subTitleSize: 16,
            subTitleColor: '#E1D7CA',
            remarkSize: 18,
            remarkColor: '#655A55',
            remarkMargin: 10
        },
        datas: historyListData,
        fixedOn: api.frameName,
        fixed: true
            // datas: [{
            //     img: 'widget://res/img/ic/sliplist.jpg',
            //     title: '12:00',
            //     headline: '刘德华',
            //     subTitle: 'APICloud粉丝见面会',
            //     titleIcon: 'widget://res/img/ic/slipList_watch.png',
            //     subTitleIcon: 'widget://res/img/ic/slipList_star.png',
            //     remark: '完成'
            // }]
    }, function(ret, err) {
        alert(JSON.stringify(ret));
        if (ret) {
            alert("刷新列表");
            refreshList();
        }
        // if (ret.eventType == "show") {
        //     pull_down_reload(UIListView);
        // }
        // if (ret.eventType == "clickContent") {
        //     UIListView.getDataByIndex({
        //         index: ret.index
        //     }, function(ret, err) {
        //         displayHis(ret.data);
        //     });
        // }
        // if (ret.eventType == "clickRightBtn" && ret.btnIndex == "0") {
        //     UIListView.getDataByIndex({
        //         index: ret.index
        //     }, function(ret, err) {
        //         modiHis(ret.data);
        //     });
        // }
        // if (ret.eventType == "clickRightBtn" && ret.btnIndex == "1") {
        //     if (confirm("确定删除？")) {
        //         UIListView.getDataByIndex({
        //             index: ret.index
        //         }, function(ret, err) {
        //             delHis(ret.data.uid);
        //             pull_down_reload();
        //         });
        //     }
        // }
    });
    historyList.setRefreshHeader({
            bgColor: "#f5f5f5",
            // loadingImg: "image/bottombtn0301.png"
        },
        function(ret, err) {
            refreshList();
        });

    // UIListView.setRefreshFooter({
    //         bgColor: "#f5f5f5",
    //         loadingImg: "image/bottombtn0301.png"
    //     },
    //     function(ret, err) {
    //         pull_up_load_more();
    //     });

}

/**
 * [pull_down_reload description]
 * @return {[type]} [description]
 */
function refreshList() {
    var userName = "me";
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId1 = ret.qid;
            query.limit({
                qid: queryId1,
                value: per_page_num
            });
            // query.justFields({
            //     qid: queryId,
            //     value: ["id", "msg", "updatedAt"]
            // });
            query.desc({
                qid: queryId1,
                column: "updatedAt"
            });
            query.whereEqual({
                qid: queryId1,
                column: 'record_doctor',
                value: userName
            })
            model.findAll({
                class: "caseHistory",
                qid: queryId1
            }, function(ret, err) {
                if (err) {
                    alert(JSON.stringify(err));
                } else {
                    var idx = 0;
                    var json_objs = [];
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
                            record_doctor: ret[idx].record_doctor
                        };



                        query.createQuery(function(ret, err) {
                            if (ret && ret.qid) {
                                var queryId2 = ret.qid;
                                var patient_id = historyItem.patient_id;
                                query.whereEqual({
                                    qid: queryId2,
                                    column: 'id',
                                    value: patient_id
                                });
                                model.findAll({
                                    class: 'patient',
                                    qid: queryId2
                                }, function(ret, err) {
                                    if (err) {
                                        alert(JSON.stringify(err));
                                    } else {
                                        historyItem.name = ret[0].name;
                                        historyItem.gender = ret[0].gender;
                                        historyItem.birthday = ret[0].birthday;
                                        historyItem.age = ret[0].age;
                                        historyItem.admission_number = ret[0].admission_number;
                                        historyItem.outpatient_number = ret[0].outpatient_number;
                                        historyItem.phone = ret[0].phone;
                                        historyItem.address = ret[0].address;
                                        historyItem.job = ret[0].job;
                                        alert(JSON.stringify(historyItem));
                                    }
                                });
                            }
                        });

                        json_objs = addListText(json_objs, historyItem);
                        idx = idx + 1;
                    }
                    loadData(json_objs);
                }
            });
        }
    })

}

function addListText(listData, item) {
    item.title = item.record_date;
    item.headline = item.name;
    item.subTitle = item.diagnosis;
    item.remark = item.treatment;
    listData.push(item);
    return listData;
}

/**
 * [pull_up_load_more description]
 * @return {[type]} [description]
 */
function pull_up_load_more() {
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            query.limit({
                qid: queryId,
                value: per_page_num
            });
            query.skip({
                qid: queryId,
                value: v_loaded_recors
            });
            // query.justFields({
            //     qid: queryId,
            //     value: ["id", "msg", "updatedAt"]
            // });
            query.desc({
                qid: queryId,
                column: "updatedAt"
            });
            model.findAll({
                class: "history",
                qid: queryId
            }, function(ret, err) {
                if (err) {
                    alert(JSON.stringify(err));
                } else {
                    if (ret) {
                        var idx = 0;
                        var json_objs = [];
                        while (ret[idx] != undefined) {
                            var listViewItem = {
                                uid: ret[idx].id,
                                title: ret[idx].name,
                                subTitle: ret[idx].disease,
                                remark: ret[idx].comeDate,
                                age: ret[idx].age,
                                sex: ret[idx].sex
                            };
                            json_objs.push(listViewItem);
                            idx = idx + 1;
                        }
                    }
                    appendData(json_objs);
                }
            });
        }
    })
}

/**
 * [reloadData description]
 * @param  {[type]} json_objs [description]
 * @return {[type]}           [description]
 */
function loadData(json_objs) {
    historyList.reloadData({
        "datas": json_objs
    });
    v_loaded_recors = per_page_num;
}

/**
 * [appendData description]
 * @param  {[type]} json_objs [description]
 * @return {[type]}           [description]
 */
function appendData(json_objs) {
    if (json_objs[0] != undefined) {
        UIListView.appendData({
                "data": json_objs
            },
            function(ret) {
                if (ret.status) {
                    // api.toast({
                    //     msg: '追加数据成功'
                    // });
                    v_loaded_recors = v_loaded_recors + per_page_num;
                }
            });
    } else {
        api.toast({
            msg: '没有更多病历了'
        });
    }
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
    })
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
    })
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
        }
    );
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
