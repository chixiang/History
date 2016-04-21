function initDBEnv() {
    openDB('history', createTable('caseHistory', createTable('patient', createTable('physical'))));
}

function openDB(dbName, callback) {
    var db = api.require('db');
    db.openDatabase({
        name: dbName,
        path: 'fs://' + dbName + '.db'
    }, function(ret, err) {
        if (ret.status) {
            // api.alert({
            //     msg: "打开数据库成功"
            // });
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
            // api.alert({
            //     msg: '关闭数据库成功'
            // });
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
            // api.alert({
            //     // msg: ret.msg
            //     msg: tableName + '表创建成功'
            // });
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

function DB_insertPatient(patient, callback) {
    var id = patient.id
    if (id != undefined && id != null && id != "") {
    var sql = "insert into patient values('" +
        patient.id + "','"
        patient.name + "','"
        patient.gender + "','"
        patient.birthday + "','"
        patient.age + "','"
        patient.admission_number + "','"
        patient.outpatient_number + "','"
        patient.phone + "','"
        patient.address + "','"
        patient.job + "','"
        patient.record_doctor + "');";
    } else {
        var sql = "insert into patient(name, gender, birthday, age, \
        admission_number, outpatient_number,phone,address,\
        job,record_doctor) values('" +
        patient.name + "','"
        patient.gender + "','"
        patient.birthday + "','"
        patient.age + "','"
        patient.admission_number + "','"
        patient.outpatient_number + "','"
        patient.phone + "','"
        patient.address + "','"
        patient.job + "','"
        patient.record_doctor + "');";
    }
    var db = api.require('db');
    db.executeSql({
        name: 'history',
        sql: sql
    }, function(ret, err) {
        if (ret.status) {
            // api.alert({
            //     // msg: ret.msg
            //     msg: tableName + '表创建成功'
            // });
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
