window.onload = function() {
    // 模拟hover事件
    // var myLinks = document.getElementsByTagName('li');
    // for (var i = 0; i < myLinks.length; i++) {
    //     myLinks[i].addEventListener('touchstart', function() {
    //         this.className = "hover";
    //     }, false);
    //     myLinks[i].addEventListener('touchend', function() {
    //         this.className = "";
    //     }, false);
    // }
    document.body.addEventListener('touchstart', function() {});
}

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
function getAge(birthday) {
    if (birthday == "" || birthday == undefined || birthday == null) {
        return "";
    }
    var r = birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) {
        return false;
    }
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
        var Y = new Date().getFullYear();
        // $api.byId('birthday').value = (Y - r[1]);
        return (Y - r[1]) + "岁";
    }
}

function JSONLength(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

function preLog(deal_table, deal_type) {
    var model = api.require('model');
    model.config({
        appId: historyConstants.appId,
        appKey: historyConstants.appKey,
        host: historyConstants.host
    });
    model.insert({
        class: historyConstants.table.log,
        value: {
            deal_table: deal_table,
            deal_type: deal_type,
            status: historyConstants.logStatus.init
        }
    }, function(ret, err) {
        if (ret) {
            return ret.id;
        } else {
            api.toast({
                msg: "预记日志失败"
            })
            return -1;
        }
    });
}

function updateLog(id, deal_id, deal_data, status) {
    var model = api.require('model');
    model.config({
        appId: historyConstants.appId,
        appKey: historyConstants.appKey,
        host: historyConstants.host
    });
    model.updateById({
        class: historyConstants.table.log,
        id: id,
        value: {
            deal_id: deal_id,
            deal_data: deal_data,
            status: status
        }
    }, function(ret, err) {
        if (ret) {

        } else {
            api.toast({
                msg: "更新日志失败"
            })
        }
    });
}

function confirmCloseWin() {
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.confirm({
            title: '请选择',
            msg: '未确认的修改会丢失，是否确认退出？',
            buttons: ['退出', '取消']
        }, function(ret, err) {
            if (ret) {
                if (ret.buttonIndex == 1) {
                    api.closeWin();
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    });
}

function initLocalHistory() {
    $api.rmStorage("history");
    $api.rmStorage("imgTmp");
    var history = {};
    var accessory_exam_pointer_tmp = {};
    $api.setStorage("history", history);
    $api.setStorage("imgTmp", accessory_exam_pointer_tmp);
}

function initLocalFollowUp() {
    $api.rmStorage("followup");
    $api.rmStorage("imgTmp");
    var followup = {};
    var accessory_exam_pointer_tmp = {};
    $api.setStorage("followup", followup);
    $api.setStorage("imgTmp", accessory_exam_pointer_tmp);
}

function setStorage(key, value) {
    $api.setStorage(key, value);
}

function getStorage(key) {
    return $api.getStorage(key);
}

function rmStorage(key) {
    $api.rmStorage(key);
}

function clearNullHistory() {
    var model = api.require('model');
    var query = api.require('query');
    model.config({
        appId: historyConstants.appId,
        appKey: historyConstants.appKey,
        host: historyConstants.host
    });
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            model.findById({
                class: "followUp",
                id: follow_up_id
            }, function(ret, err) {
                if (err) {
                    alert(JSON.stringify(err));
                } else {
                    if (ret) {
                        setFollowUp(ret);
                        api.hideProgress();
                        return ret;
                    }
                }
                api.hideProgress();
            });
        }
    });
}

/**
 * [setHistory description]
 * @param {[type]} data [description]
 */
function setHistory(data) {
    if (data != undefined && data != null) {
        $api.byId('consultation_department').value = data.consultation_department;
        $api.byId('diagnosis').value = data.diagnosis;
        $api.byId('chief_complaint').value = data.chief_complaint;
        $api.byId('treatment').value = data.treatment;
    }
}

/**
 * [setPatient 给患者信息页面字段赋值]
 * @param {[type]} data [患者信息data]
 */
function setPatient(data) {
    if (data != undefined && data != null) {
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
}

/**
 * [setPatient 给体检信息页面字段赋值]
 * @param {[type]} data [体检信息data]
 */
function setPhysical(data) {
    if (data != undefined && data != null) {
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
}

function setAccessoryExam(data) {
    if (data != undefined) {
        $api.byId("but_r").value = data.but_r;
        $api.byId("but_l").value = data.but_l;
        $api.byId("sit_r").value = data.sit_r;
        $api.byId("sit_l").value = data.sit_l;
        $api.byId("qjzx").value = data.qjzx;
        $api.byId("corneal_curvature").value = data.corneal_curvature;
        $api.byId("corneal_topography").value = data.corneal_topography;
        $api.byId("iol_master").value = data.iol_master;
        $api.byId("ubm").value = data.ubm;
        $api.byId("view_horizon").value = data.view_horizon;
        $api.byId("glaucoma_rnfl").value = data.glaucoma_rnfl;
        $api.byId("glaucoma_mri").value = data.glaucoma_mri;
        $api.byId("oct").value = data.oct;
        $api.byId("octa").value = data.octa;
        $api.byId("fundus_oculi_pic").value = data.fundus_oculi_pic;
        $api.byId("b_ultrasonic").value = data.b_ultrasonic;
        $api.byId("ffa").value = data.ffa;
        $api.byId("icg").value = data.icg;
        $api.byId("vep").value = data.vep;
        $api.byId("erg").value = data.erg;
        $api.byId("no_rnfl").value = data.no_rnfl;
        $api.byId("no_mri").value = data.no_mri;
        setImgs(data);
        // 将附加检查数据存储在临时变量中，因为每次增加图片都需拼接图片
        // 的 html，所以增加完图片要保存到
        // localStorage中，这样就不能实现取消操作了，所以在此页面的所有操作先使用
        // 临时变量，确认后再保存到localStorage中
        // setStorage("imgTmp", data);
    }
}

function setFullHistory(data) {
    if (data != undefined) {

        $api.byId('consultation_department').value = data.consultation_department;
        $api.byId('diagnosis').value = data.diagnosis;
        $api.byId('chief_complaint').value = data.chief_complaint;
        $api.byId('treatment').value = data.treatment;

        $api.byId('name').value = data.name;
        $api.byId('gender').value = data.gender;
        if (data.birthday != undefined) {
            $api.byId('birthday').value = data.birthday;
            $api.byId('age').value = getAge(data.birthday);
        }
        $api.byId('admission_number').value = data.admission_number;
        $api.byId('outpatient_number').value = data.outpatient_number;
        $api.byId('phone').value = data.phone;
        $api.byId('address').value = data.address;
        $api.byId('job').value = data.job;

    }
}

function setImgs(data) {
    var idx = 0;
    while (idx < historyConstants.imgGroup.length) {
        var imgHtml = getImgHtml(data[historyConstants.imgGroup[idx]]);
        $api.byId(historyConstants.imgGroup[idx]).innerHTML = imgHtml;
        idx = idx + 1;
    }
}

function getImgHtml(obj) {
    var size = JSONLength(obj);
    var idx = 1;
    var imgHtml = "";
    while (idx <= size) {
        imgHtml = imgHtml + "<img src=" + obj[idx + ""] + " onclick='openImg(this.src)' />";
        idx = idx + 1;
    }
    return imgHtml;
}

function openImg(url) {
    var photoBrowser = api.require('photoBrowser');
    photoBrowser.open({
        images: [
            url,
        ],
        activeIndex: 0,
        // placeholderImg: 'widget://res/img/apicloud.png',
        bgColor: '#000'
    }, function(ret) {
        if (ret.eventType == "click") {
            photoBrowser.close();
        }
    });
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
        case "date":
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
        url: 'widget://html/picker/' + frameName + '.html',
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

function patientAddEvent() {
    api.sendEvent({
        name: 'patientAddEvent',
        // extra: {
        //     patient_id: patient_id
        // }
    });
}

// function patientModiEvent(patient_id) {
//     api.sendEvent({
//         name: 'patientModiEvent',
//         extra: {
//             patient_id: patient_id
//         }
//     });
// }

function historySaveEvent(history_id) {
    api.sendEvent({
        name: 'historySaveEvent',
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

function followupSaveEvent(follow_up_id, type) {
    api.sendEvent({
        name: 'followupSaveEvent',
        extra: {
            follow_up_id: follow_up_id,
            type: type
        }
    });
}

function accessoryExamSaveEvent(accessory_exam_id) {
    api.sendEvent({
        name: 'accessoryExamSaveEvent',
        extra: {
            accessory_exam_id: accessory_exam_id
        }
    });
}

function physicalSaveEvent(physical_id) {
    api.sendEvent({
        name: 'physicalSaveEvent',
        extra: {
            physical_id: physical_id
        }
    })
}

function getFollowUp(follow_up_id) {
    showProgress();
    model = api.require('model');
    query = api.require('query');
    model.config({
        appId: 'A6903478274381',
        appKey: '460A4799-0424-A29B-6809-F06FDF1D888F',
        host: 'https://d.apicloud.com'
    });
    query.createQuery(function(ret, err) {
        if (ret && ret.qid) {
            model.findById({
                class: "followUp",
                id: follow_up_id
            }, function(ret, err) {
                if (err) {
                    alert(JSON.stringify(err));
                } else {
                    if (ret) {
                        setFollowUp(ret);
                        api.hideProgress();
                        return ret;
                    }
                }
                api.hideProgress();
            });
        }
    });
}

function setFollowUp(data) {
    $api.byId("condition").value = data.condition;
}
