function getInboxLists(UserName) {
    $$.ajax({
        url: Url + 'Inbox/Lists?name=' + UserName,
        crossDomain: true,
        success: createInboxListItems
    });
}

function getInboxDetails(id) {
    $$.ajax({
        url: Url + 'Inbox/Details?id=' + id,
        crossDomain: true,
        success: createInboxDetailsItem
    });
}

function readMail(id) {
    $$.ajax({
        method: 'POST',
        url: Url + 'Mail/Read?id=' + id,
        crossDomain: true,
        success: function(xhr) {
            console.log(xhr);
        }
    });
}

function closeMail(id, name) {
    $$.ajax({
        method: 'POST',
        url: Url + 'Mail/Close?id=' + id + '&name=' + name,
        crossDomain: true,
        success: function(xhr) {
            console.log(xhr);
            myApp.alert('Pesan telah ditutup');
        }
    });
}

function deleteInbox(id, name) {
    $$.ajax({
        method: 'POST',
        url: Url + 'Mail/Delete?id=' + id + '&name=' + name,
        crossDomain: true,
        success: function(xhr) {
            console.log(xhr);
            myApp.alert('Pesan telah dihapus', function() {
                mainView.router.loadPage('inboxes.html');
            });
        }
    });
}

function createInboxListItems(data) {
    jsonData = JSON.parse(data);
    if (jsonData.inboxLists !== null) {
        if (!($$('.inbox-list').hasClass('inbox-get'))) {
            var inboxLists = '<ul>';
            for (var i = 0; i < jsonData.inboxLists.length; i++) {
                var InboxLists = jsonData.inboxLists[i];
                inboxLists +=
                    '<li>' +
                    '   <a href="inbox-details.html" data-id="' + InboxLists.mailId + '"class="item-link item-content inbox-detail';
                if (InboxLists.mailStatus !== "Read") {
                    inboxLists += ' unread';
                }
                inboxLists +=
                    '" data-view=".view-main">' +
                    '       <div class="item-media">' +
                    '           <img style="border-radius: 50%" src="http://lorempixel.com/160/160/people/' + ((i + 1) % 10) + '" width="80" class="lazy lazy-fadein" />' +
                    '       </div>' +
                    '       <div class="item-inner">' +
                    '           <div class="item-title-row">' +
                    '               <div class="item-title">' + InboxLists.mailSender + '</div>' +
                    '               <div class="item-after">' + InboxLists.mailDate + '</div>' +
                    '           </div>' +
                    '           <div class="item-subtitle"><span class="badge bg-' + InboxLists.mailProperty.color + '">' + InboxLists.mailProperty.name + '</span>' + InboxLists.mailSubject + '</div>' +
                    '           <div class="item-text">' + InboxLists.mailNumber + '</div>' +
                    '       </div>' +
                    '   </a>' +
                    '</li>';
            }
            inboxLists += '</ul>';
            $$('.inbox-list').append(inboxLists);
            $$('.inbox-list').addClass('inbox-get');
        } else {
            $$('.inbox-list').removeClass('inbox-get');
        }
    } else {
        myApp.alert('Tidak ada kotak masuk untuk nama pengguna "' + UserName + '"', 'InEMS');
    }
}

function createInboxDetailsItem(data) {
    var jsonData = JSON.parse(data);
    var tabActions = '';
    var inboxDetails = '';
    if (jsonData.mailActive === false) {
        inboxDetails +=
            '<div class="content-block">' +
            '   <a href="#" class="button button-raised button-fill color-red">Surat ini telah ditutup</a>' +
            '</div>';
        tabActions +=
            '<a href="#" class="link delete-inbox"><i class="material-icons">&#xE872;</i></a>';
    } else {
        tabActions +=
            '<a href="disp-form.html" data-id="' + jsonData.mailId + '" class="get-mail-id link" data-force="true">' +
            '   <i class="material-icons">&#xE146;</i>' +
            '</a>' +
            '<a href="#" class="link open-popover-other"><i class="material-icons">&#xE5D4;</i></a>';
    }
    inboxDetails +=
        '<div class="content-block-title">Identitas Pengirim</div>' +
        '<div class="list-block media-list">' +
        '       <ul>' +
        '           <li>' +
        '               <div class="item-content">' +
        '                   <div class="item-media"><img style="border-radius: 50%" data-src="http://lorempixel.com/160/160/people/1" width="80" class="lazy lazy-fadein" /></div>' +
        '                   <div class="item-inner">' +
        '                       <div class="item-title-row">' +
        '                           <div class="item-title">' + jsonData.mailSender.userName + '</div>' +
        '                       </div>' +
        '                       <div class="item-subtitle">' + jsonData.mailSender.userDesc + '</div>' +
        '                       <div class="item-text">' + jsonData.mailDateCreated + '</div>' +
        '                   </div>' +
        '               </div>' +
        '           </li>' +
        '       </ul>' +
        '</div>';
    if (jsonData.mailReceiver.userName !== UserName) {
        inboxDetails +=
            '<div class="content-block-title">Identitas Penerima</div>' +
            '<div class="list-block media-list">' +
            '       <ul>' +
            '           <li>' +
            '               <div class="item-content">' +
            '                   <div class="item-media"><img style="border-radius: 50%" data-src="http://lorempixel.com/160/160/people/1" width="80" /></div>' +
            '                   <div class="item-inner">' +
            '                       <div class="item-title-row">' +
            '                           <div class="item-title">' + jsonData.mailReceiver.userName + '</div>' +
            '                       </div>' +
            '                       <div class="item-subtitle">' + jsonData.mailReceiver.userDesc + '</div>' +
            '                   </div>' +
            '               </div>' +
            '           </li>' +
            '       </ul>' +
            '</div>';
    }
    inboxDetails +=
        '<div class="content-block-title">Informasi Kotak Masuk</div>' +
        '<div class="list-block">' +
        '   <ul>' +
        '       <li>' +
        '           <div class="item-content">' +
        '               <div class="item-inner row">' +
        '                   <div class="item-title col-50">Nomor Surat</div>' +
        '                   <div class="item-after col-50">' + jsonData.mailNumber + '</div>' +
        '               </div>' +
        '           </div>' +
        '       </li>' +
        '       <li>' +
        '           <div class="item-content">' +
        '               <div class="item-inner row">' +
        '                   <div class="item-title col-50">Perihal</div>' +
        '                   <div class="item-after col-50">' + jsonData.mailSubject + '</div>' +
        '               </div>' +
        '           </div>' +
        '       </li>' +
        '       <li>' +
        '           <div class="item-content">' +
        '               <div class="item-inner row">' +
        '                   <div class="item-title col-50">Tanggal Surat</div>' +
        '                   <div class="item-after col-50">' + jsonData.mailDate + '</div>' +
        '               </div>' +
        '           </div>' +
        '       </li>' +
        '       <li>' +
        '           <div class="item-content">' +
        '               <div class="item-inner row">' +
        '                   <div class="item-title col-50">Sifat Surat</div>' +
        '                   <div class="item-after col-50">' + jsonData.mailProperty.name + '</div>' +
        '               </div>' +
        '           </div>' +
        '       </li>' +
        '   </ul>' +
        '</div>' +
        '<div class="content-block-title">Isi Surat</div>' +
        '<div class="content-block">' +
        '   <div class="content-block-inner">' +
        '       <p>' + jsonData.mailContent + '</p>' +
        '   </div>' +
        '</div>' +
        '<div class="content-block-title">Lampiran Surat</div>' +
        '<div class="content-block">' +
        '   <div class="content-block-inner">' +
        '       <p><a href="#" data-name="IMG_20150420_135422.jpg" class="link download-file">IMG_20150420_135422.jpg</a></p>' +
        '   </div>' +
        '</div>';
    $$('.inbox-details').append(inboxDetails);
    $$('.tab-action').append(tabActions);
}
