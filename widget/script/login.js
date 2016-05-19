/**
 * [apiready description]
 * @return {[type]} [description]
 */
var apiready = function() {
    userName = $api.getStorage("userName");
    if (userName != "" && userName != undefined && userName != null) {
        api.toast({
            msg: "已登陆"
        });
        openHistory();
    }
    passWord = "";

    user = api.require('user');

}

function login() {
    showProgress();
    userName = $api.byId('userName').value;
    passWord = $api.byId('passWord').value;
    user.login({
        username: userName,
        password: passWord
    }, function(ret, err) {
        hideProgress();
        if (ret) {
            api.toast({
                msg: "登陆成功"
            });
            $api.setStorage('userName', userName);
            $api.byId('passWord').value = "";
            openHistory();
        } else {
            alert("登陆失败！");
        }
    });
}

function checkMessage() {
    var model = api.require('model');
    var query = api.require('query');
    model.config({
        appId: historyConstants.appId,
        appKey: historyConstants.appKey,
        host: historyConstants.host
    });
    model.findAll({
        class: historyConstants.table.history,
        qid: queryId
    }, function(ret, err) {
        if (ret) {
            var idx = 0;
            while (ret[idx] != undefined) {
                if (ret[idx].msgType == "v") {

                }
                idx = idx + 1;
            }
        }
    });
}

function openHistory() {
    api.openWin({
        name: 'historyList',
        url: 'widget://html/history/historyList.html',
        pageParam: {},
        animation: {
            type: "movein",
            subType: "from_right",
            duration: 300
        },
        vScrollBarEnabled: false,
        slidBackEnabled: false,
        reload: true,
        bounces: false
    });
}

function openRegister() {
    api.openWin({
        name: 'register',
        url: 'signup.html',
        pageParam: {},
        animation: {
            type: "fade",
            duration: 300
        },
        vScrollBarEnabled: false,
        slidBackEnabled: false,
        reload: true,
        bounces: false
    });
}
