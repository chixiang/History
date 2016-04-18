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
 * [getAge description]
 * @param  {[type]} age [description]
 * @return {[type]}     [description]
 */
function getAge(age) {
    var r = age.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) {
        return false;
    }
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
        var Y = new Date().getFullYear();
        // $api.byId('age').value = (Y - r[1]);
        return (Y - r[1]);
    }
}

/**
 * [setHistory description]
 * @param {[type]} data [description]
 */
function setHistory(data) {
    $api.byId('consultation_department').value = data.consultation_department;
    $api.byId('diagnosis').value = data.diagnosis;
    $api.byId('chief_complaint').value = data.chief_complaint;
    $api.byId('treatment').value = data.treatment;
}

/**
 * [setPatient 给患者信息页面字段赋值]
 * @param {[type]} data [患者信息data]
 */
function setPatient(data) {
    $api.byId('name').value = data.name;
    $api.byId('gender').value = data.gender;
    if (data.birthday != undefined) {
        $api.byId('birthday').value = data.birthday.substring(0, 10);
    }
    $api.byId('age').value = data.age;
    $api.byId('admission_number').value = data.admission_number;
    $api.byId('outpatient_number').value = data.outpatient_number;
    $api.byId('phone').value = data.phone;
    $api.byId('address').value = data.address;
    $api.byId('job').value = data.job;
}

/**
 * [setPatient 给体检信息页面字段赋值]
 * @param {[type]} data [体检信息data]
 */
function setPhysical(data) {
    $api.byId('vod').value = data.vod;
    $api.byId('vos').value = data.vos;
    $api.byId('corrected_vod').value = data.corrected_vod;
    $api.byId('corrected_vos').value = data.corrected_vos;
    $api.byId('tod').value = data.tod;
    $api.byId('tos').value = data.tos;
    $api.byId('outer_eye').value = data.outer_eye;
    $api.byId('conjunctiva').value = data.conjunctiva;
    $api.byId('cornea').value = data.cornea;
    $api.byId('anterior_chamber').value = data.anterior_chamber;
    $api.byId('lens').value = data.lens;
    $api.byId('vitreous').value = data.vitreous;
    $api.byId('eyeground').value = data.eyeground;
}

function setFullHistory(data) {
    data = data[0];
    $api.byId('consultation_department').value = data.consultation_department;
    $api.byId('diagnosis').value = data.diagnosis;
    $api.byId('chief_complaint').value = data.chief_complaint;
    $api.byId('treatment').value = data.treatment;

    adata = data.patient_pointer;
    $api.byId('name').value = adata.name;
    $api.byId('gender').value = adata.gender;
    if (adata.birthday != undefined) {
        $api.byId('birthday').value = adata.birthday.substring(0, 10);
    }
    $api.byId('age').value = adata.age;
    $api.byId('admission_number').value = adata.admission_number;
    $api.byId('outpatient_number').value = adata.outpatient_number;
    $api.byId('phone').value = adata.phone;
    $api.byId('address').value = adata.address;
    $api.byId('job').value = adata.job;

    hdata = data.physical_pointer;
    if (hdata != undefined && hdata != null) {
        $api.byId('vod').value = hdata.vod;
        $api.byId('vos').value = hdata.vos;
        $api.byId('corrected_vod').value = hdata.corrected_vod;
        $api.byId('corrected_vos').value = hdata.corrected_vos;
        $api.byId('tod').value = hdata.tod;
        $api.byId('tos').value = hdata.tos;
        $api.byId('outer_eye').value = hdata.outer_eye;
        $api.byId('conjunctiva').value = hdata.conjunctiva;
        $api.byId('cornea').value = hdata.cornea;
        $api.byId('anterior_chamber').value = hdata.anterior_chamber;
        $api.byId('lens').value = hdata.lens;
        $api.byId('vitreous').value = hdata.vitreous;
        $api.byId('eyeground').value = hdata.eyeground;
    }
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

function setBlurNone() {
    api.sendEvent({
        name: 'setBlurNone'
    })
}

/**
 * [openPicker description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
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
            break;
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
            break;
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

/**
 * [showProgress description]
 * @param  {[type]} title [description]
 * @param  {[type]} text  [description]
 * @return {[type]}       [description]
 */
function showProgress(title, text) {
    if (title == undefined || title == null || title == "") {
        title = "处理中...";
    }
    if (text == undefined || text == null || text == "") {
        text = "请耐心等待";
    }

    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: title,
        text: text,
        modal: false
    });
}

function hideProgress() {
    api.hideProgress();
}

function patientAddEvent(patient_id) {
    api.sendEvent({
        name: 'patientAddEvent',
        extra: {
            patient_id: patient_id
        }
    });
}

function patientModiEvent(patient_id) {
    api.sendEvent({
        name: 'patientModiEvent',
        extra: {
            patient_id: patient_id
        }
    });
}

function physicalAddEvent(physical_id) {
    api.sendEvent({
        name: 'physicalAddEvent',
        extra: {
            physical_id: physical_id
        }
    });
}

function physicalModiEvent(physical_id) {
    api.sendEvent({
        name: 'physicalModiEvent',
        extra: {
            physical_id: physical_id
        }
    });
}

function historyAddEvent(history_id) {
    api.sendEvent({
        name: 'historyAddEvent',
        extra: {
            history_id: history_id
        }
    });
}

function historyModiEvent(history_id) {
    api.sendEvent({
        name: 'historyModiEvent',
        extra: {
            history_id: history_id
        }
    });
}
