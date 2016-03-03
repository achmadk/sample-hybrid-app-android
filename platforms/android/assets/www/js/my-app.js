// Initialize your app
var myApp = new Framework7({
    init: false,
    material: true,
    // Memungkinkan aplikasi untuk kembali ke halaman sebelumnya menggunakan hardware back button
    pushState: true,
    materialRipple: false,
    swipePanel: 'left',
    modalTitle: 'InEMS',
    modalButtonOk: 'Ya',
    modalButtonCancel: 'Tidak'
});

// Export selectors engine
var $$ = Dom7;

var mySearchbar = null;
myApp.onPageInit('index-left', function(page) {
    $$('a.nav-link').on('click', function() {
        var activeButton = $$(page.container).find('.unread');
        activeButton.removeClass('unread');
        $$(this).addClass('unread');
        if ($$(page.container).find('a[href="index.html"]').hasClass('unread')) {
            getDispositionInLists(UserId);
        }
    });

    $$('.open-login').on('click', function() {
        myApp.confirm('Apakah Anda yakin untuk keluar?', 'Konfirmasi keluar', function() {
            jsonData = null;
            dispId = null;
            mailId = null;
            $$('.view-main').find('.disposition-in-list').remove();
            $$('.view-main').find('.disposition-out-list').remove();
            setTimeout(function() {
                myApp.loginScreen();
            }, 500);
            myApp.loginScreen();
        });
    });

    $$('a.filter-link').on('click', function() {
        $$(document).find('.filter-link').removeClass('unread');
        $$(this).addClass('unread');
        mySearchbar = myApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: 'a',
            notFoud: '.searchbar-not-found'
        });
        mySearchbar.search($$(this).data('name'));
    });
});

var pageName, getPage = null;
$$(document).on('pageInit', function(e) {
    getPage = $$('.view-main').data('page');
    console.log(getPage);
    if ((getPage === 'index-1') || (getPage === 'sentboxes')) {
        $$('.filters').show();
    } else {
        $$('.filters').hide();
    }

    var page = e.detail.page;
    $$('.back').on('click', function() {
        var fromPage = page.fromPage.name;
        $$('.view-left').find('.unread').removeClass('unread');
        getPage = $$('.page-on-left').data('page');
        getPage = (getPage == 'index-1') ? 'index' : getPage;
        $$('.view-left').find('a[href="' + getPage + '.html"]').addClass('unread');
        if (getPage === 'index') {
            getDispositionInLists(UserId);
            $$('.filters').show();
        } else if (getPage === 'sentboxes') {
            getDispositionOutLists(UserId);
        } else if ((getPage === 'mail-details') || (getPage === 'memo-details')) {
            getDispositionDetails(dispId);
        }
    });

    // $$('.infinite-scroll').on('infinite', function() {
    //     if ((getPage == 'index-1') || (getPage == 'sentboxes')) {
    //         lastIndex = $$(page.container).find('.page-content').find('.list-block li').length;
    //         if (getPage == 'index-1') {
    //             createNextDispView(lastIndex, '.disposition-in-list');
    //         } else if (getPage == 'sentboxes') {
    //             createNextDispView(lastIndex, '.disposition-out-list');
    //         }
    //         lastIndex = $$(page.container).find('.page-content').find('.list-block li').length;
    //     }
    // });
});

myApp.init();

var mainView;

findSize();

var viewsWidth;

// variabel untuk mengetahui selisih waktu eksekusi sebuah fitur
var tBefore, tAfter = null;

function findSize() {
    viewsWidth = $$('.views').width();
    if (viewsWidth > 768) {
        var leftView = myApp.addView('.view-left');
    }
    mainView = myApp.addView('.view-main');
}

// Konfigurasi alamat jaringan untuk terhubung dengan web service InEMS 
// var IpAddress = '10.42.16.143'; /*Jika Online*/
var IpAddress = '10.42.160.107'; /*Jika Online*/
// var IpAddress = '127.0.0.1'; /*Jika Offline*/
var Url = 'http://' + IpAddress + ':8080/sampleWebService/REST/';

// Variabel- variabel yang digunakan untuk login ke InEMS
var alertMessage = '';
var username = null;
var password = null;
var loginData = null;
var UserId, UserName, UserDesc = null;
var chipperPassword = null;

$$('.login-screen').find('#link').on('click', function() {
    username = $$('.login-screen').find('input[name="username"]').val();
    password = $$('.login-screen').find('input[name="password"]').val();
    validateLogin(username, password);
});

var tOverallStart, tOverallEnd = null;
$$(document).on('ajaxStart', function(e) {
    tOverallStart = performance.now();
    myApp.showIndicator();
});

// Variabel untuk menampung daftar-daftar surat maupun disposisi
var jsonData = null;
var maxItem = null;
var loading = false;

// Callbacks to run code for sentboxes page:
myApp.onPageInit('sentboxes', function(page) {
    getPage = $$('.view-main').data('page');
    if (getPage == page.name) {
        getDispositionOutLists(UserId);
    }
});

var inboxId, dispId, outboxId = null;
var mailId = null;
var fileName = null;

$$(document).on('ajaxComplete', function(e) {
    myApp.hideIndicator();
    tOverallEnd = performance.now();
    console.log("Overall process:");
    console.log(tOverallEnd - tOverallStart);
    $$('a.disp-detail').on('click', function() {
        dispId = $$(this).data('id');
        if ($$(this).hasClass('unread')) {
            $$(this).removeClass('unread');
            readDisposition(dispId);
        }
        $$('.view-left').find('.unread').removeClass('unread');
    });
    $$('a.get-mail-id').on('click', function() {
        mailId = $$(this).data('id');
        console.log(mailId);
    });
    $$('a.download-file').on('click', function() {
        fileName = $$(this).data('name');
        downloadAttachment(fileName);
    });
});

$$(document).on('ajaxError', function(e) {
    myApp.hideIndicator();
});

// Callbacks to run specific code for mail-details page:
myApp.onPageInit('mail-details', function(page) {
    getPage = $$('.view-main').data('page');
    if (getPage == page.name) {
        getDispositionDetails(dispId);
    }
    $$('.toolbar').hide();
});

myApp.onPageInit('memo-details', function(page) {
    getPage = $$('.view-main').data('page');
    if (getPage == page.name) {
        getDispositionDetails(dispId);
    }
    $$('.toolbar').hide();
});

// Callbacks to run specific code for About page:
myApp.onPageInit('about', function(page) {
    createSender(UserName, UserDesc);
    $$('.about-device').on('click', function() {
        aboutDevicePage();
    });
});

var formData, FormDataJson = null;
var newMailData = null;
// Callbacks to run specific code for Form page:
myApp.onPageBeforeInit('mail-form', function(page) {
    getPage = $$('.view-main').data('page');
    if (getPage == page.name) {
        createReceiverListViews(UserName, '#tujuan');
        createReceiverListViews(UserName, '#tembusan');
        getMailMemoFormOptions(UserName);
        createSender(UserName, UserDesc);
        var calendarDateFormat = myApp.calendar({
            input: '#calendar-input',
            dateFormat: 'MM dd, yyyy'
        });
    }
    $$('.send-mail-form').on('click', function() {
        createMailMemo(page, '#form-mail', UserId);
        return false;
    });
});

var newMemoData = null;
myApp.onPageBeforeInit('memo-form', function(page) {
    getPage = $$('.view-main').data('page');
    if (getPage == page.name) {
        createReceiverListViews(UserName, '#tujuan');
        createReceiverListViews(UserName, '#tembusan');
        getMailMemoFormOptions(UserName);
        createSender(UserName, UserDesc);
        var calendarDateFormat = myApp.calendar({
            input: '#calendar-input',
            dateFormat: 'MM dd, yyyy'
        });
    }
    $$('.send-memo-form').on('click', function() {
        createMailMemo(page, '#form-memo', UserId);
        return false;
    });
});

var newDispData = null;
// Callbacks to run specific code for Form page:
myApp.onPageBeforeInit('disp-form', function(page) {
    getPage = $$('.view-main').data('page');
    if (getPage == page.name) {
        createReceiverListViews(UserName, '#tujuan');
        createReceiverListViews(UserName, '#tembusan');
        getDispositionFormOptions(UserName);
        var calendarDateFormat = myApp.calendar({
            input: '#calendar-input',
            dateFormat: 'MM dd, yyyy'
        });
    }
    $$('.send-disp-form').on('click', function() {
        processDisposition('#form-disp', mailId, UserId);
        return false;
    });
});

var myDevice = myApp.device;

function aboutDevicePage() {
    myApp.alert(
        'I use ' + myDevice.os + ' version ' + myDevice.osVersion + ' with ' + myDevice.pixelRatio + ' pixel ratio', 'My Device');
}
