/**
 * [apiready description]
 * @return {[type]} [description]
 */
var apiready = function() {
    // $api.fixIos7Bar($api.dom('header'));

    userName = $api.getStorage("userName");
    if (userName != "" && userName != undefined && userName != null) {
        openHistory();
    }
    passWord = "";

    model = api.require('model');
    query = api.require('query');
    model.config({
        appId: historyConstants.appId,
        appKey: historyConstants.appKey,
        host: historyConstants.host
    });

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
            // alert("登录成功！");
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

function register() {
    userName = $api.byId('userName').value;
    passWord = $api.byId('passWord').value;
    if (userName == "" || passWord == "") {
        alert("请输入用户名和密码后点击【注册】");
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
        reload: true,
        bounces: false
    });
}
