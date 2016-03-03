function createReceiverListViews(name, id) {
    var autoCompleteReceiver = myApp.autocomplete({
        openIn: 'page',
        opener: $$(id),
        multiple: true,
        valueProperty: 'id',
        textProperty: 'name',
        limit: 20,
        preloader: true,
        preloaderColor: 'white',
        source: function(autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            autocomplete.showPreloader();
            $$.ajax({
                url: Url + 'User/Receivers?name=' + name,
                crossDomain: true,
                dataType: 'json',
                success: function(data) {
                    for (var i = 0; i < data.users.length; i++) {
                        if (data.users[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data.users[i]);
                    }
                    autocomplete.hidePreloader();
                    render(results);
                }
            });
        },
        onChange: function(autocomplete, value) {
            var itemText = [],
                inputValue = [];
            for (var i = 0; i < value.length; i++) {
                itemText.push(value[i].name);
                inputValue.push(value[i].id);
            }
            $$(id).find('.item-after').text(itemText.join(', '));
            $$(id).find('input').val(inputValue);
        }
    });
}

function getMailMemoFormOptions(name) {
    tBefore = performance.now();
    $$.ajax({
        url: Url + 'Form/MailMemo?name=' + name,
        crossDomain: true,
        dataType: 'json',
        success: createMailMemoFormOptions
    });
    tAfter = performance.now();
    console.log("get mail/memo form json took time (ms) = ");
    console.log(tAfter - tBefore);
}

function getDispositionFormOptions(name) {
    tBefore = performance.now();
    $$.ajax({
        url: Url + 'Form/Disp?name=' + name,
        crossDomain: true,
        dataType: 'json',
        success: createDispFormOptions
    });
    tAfter = performance.now();
    console.log("get disposition form json took time (ms) = ");
    console.log(tAfter - tBefore);
}

function createMailMemoFormOptions(data) {
    tBefore = performance.now();
    createAttributeViews(data);
    // createReceiverListViews(data);
    tAfter = performance.now();
    console.log("create mail/memo form took time (ms) = ");
    console.log(tAfter - tBefore);
}

function createDispFormOptions(data) {
    tBefore = performance.now();
    createAttributeViews(data);
    // createReceiverListViews(data);
    createDispInstrListViews(data);
    tAfter = performance.now();
    console.log("create disposition form took time (ms) = ");
    console.log(tAfter - tBefore);
}

function getReceiversName(name) {
    $$.ajax({
        url: Url + 'User/Receivers?name=' + name,
        crossDomain: true,
        dataType: 'json',
        success: function(data) {
            createReceiverListViews(data, 'name');
        }
    });
}

function getReceiversId(name) {
    $$.ajax({
        url: Url + 'User/Receivers?name=' + name,
        crossDomain: true,
        dataType: 'json',
        success: function(data) {
            createReceiverListViews(data, 'id');
        }
    });
}

// function createReceiverListViews(data) {
//     var createReceiverLists = '';
//     for (var i = 0; i < data.usersNotMe.length; i++) {
//         var UserLists = data.usersNotMe[i];
//         createReceiverLists +=
//             '<option data-option-image="http://lorempixel.com/29/29/" value="' + UserLists.id + '" >' + UserLists.name + '</option>';
//     }
//     $$('.create-receiver-lists-id').append(createReceiverLists);
// }

function getDispInstrLists() {
    $$.ajax({
        url: Url + 'Disposition/InstrLists',
        crossDomain: true,
        dataType: 'json',
        success: createDispInstrListViews
    });
}

function createDispInstrListViews(data) {
    var createDispInstrLists = data.dispInstrLists.map(function(lists) {
        return '<option value="' + lists.id + '" >' + lists.name + '</option>';
    }).toString().replace(/,/g, "");
    $$('.create-disp-instr-lists').append(createDispInstrLists);

}

function getAttributes() {
    $$.ajax({
        url: Url + 'Mail/AttrLists',
        crossDomain: true,
        dataType: 'json',
        success: createAttributeViews
    });
}

function createAttributeViews(data) {
    var createMailAttrLists = data.mailProperty.map(function(lists) {
        return '<option value="' + lists.id + '" >' + lists.name + '</option>';
    }).toString().replace(/,/g, "");
    $$('.create-mail-attr-lists').append(createMailAttrLists);
}

function createMail() {

    $$.ajax({
        method: 'POST',
        url: Url + 'Mail/Create',
        data: newMailData,
        crossDomain: true,
        success: viewPostMailResult
    });

}

function createMemo() {
    tBefore = performance.now();
    $$.ajax({
        method: 'POST',
        url: Url + 'Memo/Create',
        data: newMemoData,
        crossDomain: true,
        success: viewPostMemoResult
    });

}

function uploadAttachment() {
    tBefore = performance.now();
    $$.ajax({
        method: 'POST',
        // url: Url + 'Files/Upload',
        url: Url + 'Files/UploadFTP',
        data: formData,
        crossDomain: true,
        cache: false,
        contentType: false,
        processData: false,
        success: viewPostAttachmentResult
    });
    tAfter = performance.now();
    console.log("upload attachment took time (ms) = ");
    console.log(tAfter - tBefore);
}

var dlUrl = null;

function getDownloadUrl(name) {
    tBefore = performance.now();
    $$.ajax({
        method: 'GET',
        url: Url + 'Files/Download?name=' + name,
        crossDomain: true,
        cache: false,
        contentType: false,
        processData: false,
        success: setDownloadUrl
    });
    tAfter = performance.now();
    console.log("get download url took time (ms) = ");
    console.log(tAfter - tBefore);
}

function createDisp() {

    $$.ajax({
        method: 'POST',
        url: Url + 'Disposition/Create',
        data: newDispData,
        crossDomain: true,
        success: viewPostDispResult
    });
}

function viewPostDispResult(data) {
    console.log(data);
    routeAfterPost('Disposisi');
}

function viewPostMailResult(data) {
    console.log(data);
    routeAfterPost('Surat');
}

function viewPostMemoResult(data) {
    console.log(data);
    routeAfterPost('Nota Dinas');
}

var upload = '';
function viewPostAttachmentResult(data) {
    console.log(data);
    upload = ' dan Lampiran';
}

function routeAfterPost(text) {
    myApp.alert(text + upload + ' telah dikirim', function() {
        mainView.router.loadPage('sentboxes.html');
    });
}

function setDownloadUrl(xhr) {
    console.log(xhr);
    dlUrl = xhr;
}

function downloadAttachment(name) {
    myApp.showPreloader('Sedang mengunduh');
    getDownloadUrl(name);
    var folderName = 'Lampiran_InEMS';
    var DownloadPath = null;
    var whereToSave = (device.platform == "iOS") ? cordova.file.syncedDataDirectory : cordova.file.externalRootDirectory;
    tBefore = performance.now();
    window.resolveLocalFileSystemURL(whereToSave, function(fs) {
        fs.getDirectory(folderName, {
            create: true,
            exclusive: false
        }, function(fileEntry) {
            console.log('creating folder success ' + fileEntry);
            DownloadPath = fileEntry.toURL() + name;
            console.log(DownloadPath);
            var ft = new FileTransfer();
            ft.download(encodeURI(dlUrl), DownloadPath, function(entry) {
                myApp.hidePreloader();
                console.log("download file success :) . The path is: " + entry.toURL());
                myApp.alert(name + " selesai diunduh di folder Lampiran_InEMS");
            }, failDownload);
        }, fail);
    }, fail);
    tAfter = performance.now();
    console.log("download attachment time (ms) = ");
    console.log(tAfter - tBefore);
}

function fail(error) {
    console.log("error:" + error.code);
}

function failDownload(error) {
    myApp.hidePreloader();
    myApp.prompt('Lampiran tidak dapat diunduh. Silakan coba lagi', 'InEMS', function() {
        downloadAttachment(fileName);
    });
}

function createSender(name, desc) {
    var senderInfo =
        '<div class="item-media"><img style="border-radius: 50%" src="http://lorempixel.com/160/160/people/1" width="80" /></div>' +
        '   <div class="item-inner">' +
        '       <div class="item-title-row">' +
        '           <div class="item-title">' + name + '</div>' +
        '       </div>' +
        '   <div class="item-subtitle">' + desc + '</div>' +
        '</div>';
    $$('.sender-info').append(senderInfo);
}

function createMailMemo(page, formId, userId) {
    FormDataJson = myApp.formToJSON(formId);
    FormDataJson.pengirim = userId;
    FormDataJson.tujuan = (FormDataJson.tujuan === "") ? [] : FormDataJson.tujuan.split(',');
    FormDataJson.tembusan = (FormDataJson.tembusan === "") ? [] : FormDataJson.tembusan.split(',');
    console.log(FormDataJson);
    if ((FormDataJson.tujuan.length !== 0) && (FormDataJson.perihal !== "") && (FormDataJson.sifat !== 0)) {
        if (processAttachment(formId) === true) {
            if (page.name == 'mail-form') {
                FormDataJson.jenis = "surat";
                if (FormDataJson.tanggal === "") {
                    myApp.alert("Pastikan tanggal surat tidak boleh kosong");
                } else {
                    newMailData = JSON.stringify(FormDataJson);
                    console.log(newMailData);
                    createMail();
                }
            } else {
                FormDataJson.jenis = "memo";
                newMemoData = JSON.stringify(FormDataJson);
                console.log(newMemoData);
                createMemo();
            }
        }
    } else {
        myApp.alert("Pastikan tujuan, perihal, dan sifat surat/nota dinas tidak boleh kosong");
    }
}

function processAttachment(formId) {
    var url = encodeURI(FormDataJson.lampiran);
    FormDataJson.lampiran = (url.lastIndexOf('\\') == -1) ? url.substring(url.lastIndexOf('%5C') + 3) : FormDataJson.lampiran;
    var fileExt = null;
    var accFileExt = ".doc .docx .xls .xlsx .pdf .jpg .bmp .zip .rar".split(" ");
    if (FormDataJson.lampiran.length !== 0) {
        fileExt = url.substring(url.lastIndexOf('.'));
        console.log(url.lastIndexOf('\\') + " " + fileExt + " " + accFileExt.toString());
        console.log((accFileExt.indexOf(fileExt) == -1) + " " + (url.indexOf('%') !== -1));
        console.log(JSON.stringify(FormDataJson));
        if ((accFileExt.indexOf(fileExt) == -1) || (url.indexOf('%') == -1)) {
            myApp.alert("Pastikan lampiran yang diunggah tidak terdapat spasi dan sesuai dengan yang ada di dalam daftar");
            return false;
        } else {
            formData = new FormData($$(formId)[0]);
            uploadAttachment();
            return true;
        }
    } else return true;
}

function processDisposition(formId, mailId, userId) {
    FormDataJson = myApp.formToJSON(formId);
    FormDataJson.pengirim = userId;
    FormDataJson.surat = mailId;
    FormDataJson.tujuan = (FormDataJson.tujuan === "") ? [] : FormDataJson.tujuan.split(',');
    FormDataJson.tembusan = (FormDataJson.tembusan === "") ? [] : FormDataJson.tembusan.split(',');
    FormDataJson.batasWaktu = (FormDataJson.batasWaktu === "") ? "January 01, 1970" : FormDataJson.batasWaktu;
    console.log(FormDataJson);
    if ((FormDataJson.tujuan.length !== 0) && (FormDataJson.sifat !== "0") && (FormDataJson.instruksi !== "0")) {
        newDispData = JSON.stringify(FormDataJson);
        console.log(newDispData);
        tBefore = performance.now();
        createDisp();
        tAfter = performance.now();
        console.log("send disp form took time (ms) = ");
        console.log(tAfter - tBefore);
    } else {
        myApp.alert("Pastikan tujuan, instruksi, dan sifat disposisi tidak boleh kosong");
    }
}
