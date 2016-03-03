function getOutboxLists(UserName) {
    $$.ajax({
        url: Url + 'Outbox/Lists?name=' + UserName,
        crossDomain: true,
        success: createOutboxListItems
    });
}

function getOutboxDetails(id) {
    $$.ajax({
        url: Url + 'Outbox/Details?id=' + id,
        crossDomain: true,
        success: createOutboxDetailsItem
    });
}

function deleteOutbox(id, name) {
    $$.ajax({
        method: 'POST',
        url: Url + 'Mail/Delete?id=' + id + '&name=' + name,
        crossDomain: true,
        success: function(xhr) {
            console.log(xhr);
            myApp.alert('Pesan telah dihapus', function() {
                mainView.router.loadPage('outboxes.html');
            });
        }
    });
}

function createOutboxListItems(data) {
    jsonData = JSON.parse(data);
    if (jsonData.outboxLists !== null) {
        if (!($$('.outbox-list').hasClass('outbox-get'))) {
            var outboxLists = '<ul>';
            for (var i = 0; i < jsonData.outboxLists.length; i++) {
                var OutboxLists = jsonData.outboxLists[i];
                outboxLists +=
                    '<li>' +
                    '   <a href="outbox-details.html" data-id="' + OutboxLists.mailId + '"class="item-link item-content outbox-detail" data-view=".view-main">' +
                    '       <div class="item-media">' +
                    '           <img style="border-radius: 50%" src="http://lorempixel.com/160/160/people/' + i + '" width="80" class="lazy lazy-fadein" />' +
                    '       </div>' +
                    '       <div class="item-inner">' +
                    '           <div class="item-title-row">' +
                    '               <div class="item-title">' + OutboxLists.mailReceiver + '</div>' +
                    '               <div class="item-after">' + OutboxLists.mailDate + '</div>' +
                    '           </div>' +
                    '           <div class="item-subtitle"><span class="badge bg-' + OutboxLists.mailProperty.color + '">' + OutboxLists.mailProperty.name + '</span>' + OutboxLists.mailSubject + '</div>' +
                    '           <div class="item-text">' + OutboxLists.mailNumber + '</div>' +
                    '       </div>' +
                    '   </a>' +
                    '</li>';
            }
            outboxLists += '</ul>';
            $$('.outbox-list').append(outboxLists);
            $$('.outbox-list').addClass('outbox-get');
        } else {
            $$('.outbox-list').removeClass('outbox-get');
        }
    } else {
        myApp.alert('Tidak ada surat keluar dari nama pengguna "' + UserName + '"', 'InEMS');
    }
}

function createOutboxDetailsItem(data) {
    var jsonData = JSON.parse(data);
    var outboxDetails = '';
    var tabActions = '';
    if (jsonData.mailActive === false) {
        outboxDetails +=
            '<div class="content-block">' +
            '   <a href="#" class="button button-raised button-fill color-red">Surat ini telah ditutup</a>' +
            '</div>';
        tabActions +=
            '<a href="#" class="link delete-outbox"><i class="material-icons">&#xE872;</i></a>';
    } else {
        tabActions +=
            '<a href="disp-form.html" data-id="' + jsonData.mailId + '" class="get-mail-id link" data-force="true">' +
            '   <i class="material-icons">&#xE146;</i>' +
            '</a>' +
            '<a href="#" class="link open-popover-other"><i class="material-icons">&#xE5D4;</i></a>';
    }
    outboxDetails +=
        '<div class="content-block-title">Identitas Penerima</div>' +
        '<div class="list-block media-list">' +
        '       <ul>' +
        '           <li>' +
        '               <div class="item-content">' +
        '                   <div class="item-media"><img style="border-radius: 50%" data-src="http://lorempixel.com/160/160/people/1" width="80" class="lazy lazy-fadein" /></div>' +
        '                   <div class="item-inner">' +
        '                       <div class="item-title-row">' +
        '                           <div class="item-title">' + jsonData.mailReceiver.userName + '</div>' +
        '                       </div>' +
        '                       <div class="item-subtitle">' + jsonData.mailReceiver.userDesc + '</div>' +
        '                       <div class="item-text">' + jsonData.mailDateCreated + '</div>' +
        '                   </div>' +
        '               </div>' +
        '           </li>' +
        '       </ul>' +
        '</div>' +
        '<div class="content-block-title">Informasi Surat Keluar</div>' +
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
        '                   <div class="item-title col-50">Nomor Surat</div>' +
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
        '</div>';
    $$('.outbox-details').append(outboxDetails);
    $$('.tab-action').append(tabActions);
}
