function emptyUserLogin(usr, pwd) {
    if (usr.length === 0 && pwd.length === 0) {
        alertMessage = 'Nama pengguna dan kata sandi tidak boleh kosong!';
        return true;
    }
    if (usr.length === 0 && pwd.length !== 0) {
        alertMessage = 'Nama pengguna boleh kosong!';
        return true;
    } else if (usr.length !== 0 && pwd.length === 0) {
        alertMessage = 'Kata sandi boleh kosong!';
        return true;
    } else {
        return false;
    }
}

function validateLogin(username, password) {
    // tBefore = performance.now();
    if (!(emptyUserLogin(username, password))) {
        chipperPassword = CryptoJS.SHA1(password);
        loginData = JSON.stringify({
            "name": username,
            "password": chipperPassword.toString()
        });
        getUserAccount();
    } else {
        myApp.alert(alertMessage, 'Isian kosong');
    }
    // tAfter = performance.now();
    // console.log("validate login time (ms) = ");
    // console.log(tAfter - tBefore);
}

function getUserAccount() {
    var tBefore1 = performance.now();
    $$.ajax({
        url: Url + 'User/Login',
        method: 'POST',
        processData: true,
        data: loginData,
        crossDomain: true,
        dataType: 'json',
        error: userNotFound,
        success: getUserInfo
    });
    var tAfter1 = performance.now();
    console.log("get user account info time (ms) = ");
    console.log(tAfter1 - tBefore1);
}

function userNotFound(status) {
    myApp.alert('Kombinasi nama pengguna dan/atau kata sandi tidak sesuai. Silakan coba lagi', 'Tidak Ditemukan Pengguna ' + username);
}


function getUserInfo(data) {
    var tBefore1 = performance.now();
    if (data !== null) {
        UserId = data.id;
        UserName = data.name;
        UserDesc = data.title;
        myApp.closeModal('.login-screen');
        // mainView.router.loadPage('index-1.html');
        if (viewsWidth <= 768) {
            $$('.login-screen').hide();
        }
        var tAfter1 = performance.now();
        console.log("copy user account info to app time (ms) = ");
        console.log(tAfter1 - tBefore1);
        if (!($$('.view-main').find('.list-block.media-list').hasClass('disposition-in-list'))) {
            $$('.view-main').find('.page-content').append('<div class="list-block media-list disposition-in-list list-block-search searchbar-found"></div>');
        }
        getDispositionInLists(UserId);
    } else {
        userNotFound(status);
    }
}
