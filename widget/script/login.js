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

function register() {
    userName = $api.byId('userName').value;
    passWord = $api.byId('passWord').value;
    if (userName == "" || passWord == "") {
        alert("1. 请输入要注册的用户名和密码\n2. 点击【注册】即可完成注册");
        return;
    }
    showProgress();
    user.register({
        username: userName,
        password: passWord
    }, function(ret, err) {
        hideProgress();
        if (ret.error) {
            switch (ret.error.statusCode) {
                case 202:
                    alert("用户已存在");
                    break;
                default:
                    alert("注册用户失败！");
                    break;
            }
        } else {
            alert("用户注册成功！");
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
