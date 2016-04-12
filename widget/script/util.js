/**
 * [getDate 获得当前日期，格式为YYYY-MM-DD]
 * @return {[type]} [description]
 */
function getDate() {
    var date = new Date();
    var formatDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return formatDate.replace(/\b(\w)\b/g, '0$1');
}

/**
 * [setPatient 给患者信息页面字段赋值]
 * @param {[type]} data [患者信息data]
 */
function setPatient(data) {
    $api.byId('name').value = data.name;
    $api.byId('gender').value = data.gender;
    $api.byId('birthday').value = data.birthday.substring(0, 10);
    $api.byId('age').value = data.age;
    $api.byId('admission_number').value = data.admission_number;
    $api.byId('outpatient_number').value = data.outpatient_number;
    $api.byId('phone').value = data.phone;
    $api.byId('address').value = data.address;
    $api.byId('job').value = data.job;
}

/**
 * [setBlur description]
 * @param {[type]}  id     [description]
 * @param {Boolean} isTrue [description]
 */
function setBlur(id, isTrue) {
    if (isTrue) {
        $api.byId(id).style.webkitFilter = "blur(5px) contrast(0.4) brightness(1.4)";
    } else {
        $api.byId(id).style.webkitFilter = "";
    }
}
