function initDBEnv() {
    var db = api.reuqire('db');
    openDB('history', createTable('caseHistory', createTable('patient', createTable('physical'))));
}

function openDB(dbName, callback) {
    var db = api.require('db');
    db.openDatabase({
        name: dbName,
        path: 'fs://' + dbName + '.db'
    }, function(ret, err) {
        if (ret.status) {
            api.alert({
                // msg: "打开数据库成功"
                msg: ret.msg
            });
            if (typeof callback != "undefined") {
                callback();
            }
        } else {
            api.alert({
                msg: err.msg
            });

        }
    });
}

function closeDB() {
    var db = api.require('db');
    db.closeDatabase({
        name: 'history'
    }, function(ret, err) {
        if (ret.status) {
            api.alert({
                // msg: '关闭数据库成功'
                msg: ret.msg
            });
        } else {
            api.alert({
                msg: err.msg
            });
        }
    });
}


function createTable(tableName, callback) {
    var sql = "";
    switch (tableName) {
        case "caseHistory":
            sql = historySql.createCaseHistory;
            break;
        case "patient":
            sql = historySql.createPatient;
            break;
        case "physical":
            sql = historySql.createPhysical;
            break;
        default:
            break;
    }
    if (sql == "") {
        api.alert({
            msg: "我不知道该创建什么表~~~"
        })
        return;
    }
    var db = api.require('db');
    db.executeSql({
        name: 'history',
        sql: sql
    }, function(ret, err) {
        if (ret.status) {
            api.alert({
                msg: ret.msg
                // msg: tableName + '表创建成功'
            });
            if (typeof callback != "undefined") {
                callback();
            }
        } else {
            api.alert({
                msg: err.msg
            });
        }
    });
}
