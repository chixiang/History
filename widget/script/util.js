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

/**
 * @param  {[type]}
 * @return {[type]}
 */
function openPicker(type) {
    var frameName = "";
    // 选择器的高度：行数*50+50，小于3行算3行
    var height = 200;
    var reload = false;
    pageParam = {};
    switch (type) {
        case "birthday":
            frameName = "birthdayPickerFrame";
            height = 300;
            break;
        case "gender":
            frameName = "genderPickerFrame";
            height = 200;
            break;
        case "consultation_department":
            frameName = "condepPickerFrame";
            height = 300;
        case "vod":
        case "vos":
        case "corrected_vod":
        case "corrected_vos":
            frameName = "visionPickerFrame";
            height = 300;
            reload = true;
            pageParam = {
                "visionType": type
            }
        default:
            break;
    }
    api.openFrame({
        name: frameName,
        url: './picker/' + frameName + '.html',
        pageParam: pageParam,
        reload: reload,
        bounces: false,
        rect: {
            marginLeft: 0,
            marginTop: api.winHeight - height,
            marginBottom: 0,
            marginRight: 0
        },
        animation: {
            type: "fade",
            subType: "from_right",
            duration: 300
        }
    })

}
