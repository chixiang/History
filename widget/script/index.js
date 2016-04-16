/**
 * [apiready description]
 * @return {[type]} [description]
 */
var apiready = function() {
    $api.fixIos7Bar($api.dom('header'));

    userName = $api.getStorage("userName");
    if (userName != "" && userName != undefined && userName != null) {
        openHistory();
    }
    passWord = "";

    model = api.require('model');
    query = api.require('query');
    model.config({
        appId: 'A6903478274381',
        appKey: '460A4799-0424-A29B-6809-F06FDF1D888F',
        host: 'https://d.apicloud.com'
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
        api.hideProgress();
        if (ret) {
            alert("登录成功！");
            $api.setStorage('userName', userName);
            $api.setStorage('id', ret.id);
            $api.byId('passWord').value = "";
            openHistory();
        } else {
            alert("登陆失败！");
        }
    });
}

function register() {
    showProgress();
    userName = $api.byId('userName').value;
    passWord = $api.byId('passWord').value;
    user.register({
        username: userName,
        password: passWord
    }, function(ret, err) {
        api.hideProgress();
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
        url: './historyList.html',
        pageParam: {},
        animation: {
            type: "movein",
            subType: "from_right",
            duration: 300
        },
        reload: true,
        bounces: false
    });
}
