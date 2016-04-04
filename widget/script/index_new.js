var apiready = function() {
    $api.fixStatusBar($api.dom('header'));
    var listViewData = [];
    v_loaded_recors = 5;
    model = api.require('model');
    query = api.require('query');
    model.config({
        appId: 'A6903478274381',
        appKey: '460A4799-0424-A29B-6809-F06FDF1D888F',
        host: 'https://d.apicloud.com'
    });
    UIListView = api.require('UIListView');
    UIListView.open({
        rect: {
            x: 0,
            y: $api.dom('header').offsetHeight,
            w: api.winWidth,
            h: $api.dom('#main').offsetHeight
        },
        data: listViewData,
        rightBtns: [{
            bgColor: '#888', //（可选项）字符串类型；按钮背景色，支持rgb、rgba、#；默认：'#388e8e'
            activeBgColor: '', //（可选项）字符串类型；按钮按下时的背景色，支持rgb、rgba、#
            width: 70, //（可选项）数字类型；按钮的宽度；默认：w / 4
            title: '修改', //（可选项）字符串类型；按钮标题，水平、垂直居中
            titleSize: 12, //（可选项）数字类型；按钮标题文字大小；默认：12
            titleColor: '#fff', //（可选项）字符串类型；按钮标题文字颜色，支持rgb、rgba、#；默认：'#ffffff'
            icon: '', //（可选项）字符串类型；按钮标题前的图标路径（本地路径，支持fs://，widget://），水平、垂直居中，图标为正方形
            iconWidth: 20 //（可选项）数字类型；按钮标题前的图标宽度，图标为正方形；默认：20
        }, {
            bgColor: '#888', //（可选项）字符串类型；按钮背景色，支持rgb、rgba、#；默认：'#388e8e'
            activeBgColor: '', //（可选项）字符串类型；按钮按下时的背景色，支持rgb、rgba、#
            width: 70, //（可选项）数字类型；按钮的宽度；默认：w / 4
            title: '删除', //（可选项）字符串类型；按钮标题，水平、垂直居中
            titleSize: 12, //（可选项）数字类型；按钮标题文字大小；默认：12
            titleColor: '#fff', //（可选项）字符串类型；按钮标题文字颜色，支持rgb、rgba、#；默认：'#ffffff'
            icon: '', //（可选项）字符串类型；按钮标题前的图标路径（本地路径，支持fs://，widget://），水平、垂直居中，图标为正方形
            iconWidth: 20 //（可选项）数字类型；按钮标题前的图标宽度，图标为正方形；默认：20
        }],
        styles: {
            borderColor: '#696969',
            item: {
                bgColor: '#eee',
                activeBgColor: '#F5F5F5',
                height: 55.0,
                imgWidth: 40,
                imgHeight: 40,
                imgCorner: 4,
                placeholderImg: '',
                titleSize: 12.0,
                titleColor: '#000',
                subTitleSize: 12.0,
                subTitleColor: '#000',
                remarkColor: '#000',
                remarkSize: 16,
                remarkIconWidth: 30
            }
        },
        fixedOn: api.frameName
    }, function(ret, err) {
        pull_down_reload(UIListView);
    });
    UIListView.setRefreshHeader({
            bgColor: "#f5f5f5",
            loadingImg: "image/bottombtn0301.png"
        },
        function(ret, err) {
            pull_down_reload();
        });

    UIListView.setRefreshFooter({
            bgColor: "#f5f5f5",
            loadingImg: "image/bottombtn0301.png"
        },
        function(ret, err) {
            pull_up_load_more();
        });

}

function pull_down_reload() {
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            query.limit({
                qid: queryId,
                value: 5
            });
            // query.justFields({
            //     qid: queryId,
            //     value: ["id", "msg", "updatedAt"]
            // });
            // query.desc({
            //     qid: queryId,
            //     column: "updatedAt"
            // });
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
                                remark: ret[idx].comeDate
                            };
                            json_objs.push(listViewItem);
                            idx = idx + 1;
                        }
                    }
                    reloadData(json_objs);
                }
            });
        }
    })

}

function pull_up_load_more() {
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            var queryId = ret.qid;
            query.limit({
                qid: queryId,
                value: 5
            });
            query.skip({
                qid: queryId,
                value: v_loaded_recors
            });
            // query.justFields({
            //     qid: queryId,
            //     value: ["id", "msg", "updatedAt"]
            // });
            // query.desc({
            //     qid: queryId,
            //     column: "updatedAt"
            // });
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
                                remark: ret[idx].comeDate
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

function reloadData(json_objs) {
    UIListView.reloadData({
            "data": json_objs
        },
        function(ret) {
            if (ret.status) {
                api.toast({
                    msg: '加载数据成功'
                });
                v_loaded_recors = 5;
            }
        })
}

function appendData(json_objs) {
    if (json_objs[0] != undefined) {
        UIListView.appendData({
                "data": json_objs
            },
            function(ret) {
                if (ret.status) {
                    api.toast({
                        msg: '追加数据成功'
                    });
                    v_loaded_recors = v_loaded_recors + 5;
                }
            });
    } else {
        api.toast({
            msg: '没有更多数据了'
        });
    }
}

function openWin(type) {
    api.openWin({
        name: type,
        url: './html/' + type + '.html',
        pageParam: {},
        reload: true,
        bounces: false
    });
}

function openSearch() {
    var UISearchBar = api.require('UISearchBar');
    UISearchBar.open({
        placeholder: '请输入搜索关键字',
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
