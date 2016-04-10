/**
 * [getDate description]
 * @return {[type]} [description]
 */
function getDate() {
    var date = new Date();
    var formatDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return formatDate.replace(/\b(\w)\b/g, '0$1');
}

function setPatient(data) {
    $api.byId('name').value = data.name;
    $api.byId('gender').value = data.gender ? "男" : "女";
    $api.byId('birthday').value = data.birthday.substring(0, 10);
    $api.byId('age').value = data.age;
    $api.byId('admission_number').value = data.admission_number;
    $api.byId('outpatient_number').value = data.outpatient_number;
    $api.byId('phone').value = data.phone;
    $api.byId('address').value = data.address;
    $api.byId('job').value = data.job;
}
