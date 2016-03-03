function getDispositionInLists(UserId) {
    tBefore = performance.now();
    $$.ajax({
        method: 'GET',
        url: Url + 'Disposition/Lists/In?userId=' + UserId,
        crossDomain: true,
        success: createDispositionInListItems
    });
    tAfter = performance.now();
    console.log("get surat masuk lists json time (ms) = ");
    console.log(tAfter - tBefore);
}

function getDispositionOutLists(UserId) {
    tBefore = performance.now();
    $$.ajax({
        method: 'GET',
        url: Url + 'Disposition/Lists/Out?userId=' + UserId,
        crossDomain: true,
        success: createDispositionOutListItems
    });
    tAfter = performance.now();
    console.log("get surat kirim lists json time (ms) = ");
    console.log(tAfter - tBefore);
}

function getDispositionDetails(id) {
    tBefore = performance.now();
    $$.ajax({
        method: 'GET',
        url: Url + 'Disposition/Details?dispId=' + id,
        crossDomain: true,
        success: createDispositionDetailsItem
    });
    tAfter = performance.now();
    console.log("get surat details json time (ms) = ");
    console.log(tAfter - tBefore);
}

function readDisposition(id) {
    tBefore = performance.now();
    $$.ajax({
        method: 'POST',
        url: Url + 'Disposition/Read?id=' + id,
        crossDomain: true,
        success: function(xhr) {
            console.log(xhr);
        }
    });
    tAfter = performance.now();
    console.log("read surat details json time (ms) = ");
    console.log(tAfter - tBefore);
}

function deleteDisp(id, name) {
    $$.ajax({
        method: 'POST',
        url: Url + 'Disposition/Delete?id=' + id + '&name=' + name,
        crossDomain: true,
        success: function(xhr) {
            console.log(xhr);
            myApp.alert('Disposisi telah dihapus', function() {
                mainView.router.loadPage('inboxes.html');
            });
        }
    });
}

var jsonDataGet = null;

function createDispositionInListItems(data) {
    jsonDataGet = JSON.parse(data);
    jsonData = jsonDataGet;
    createDispView('.disposition-in-list');
}

function createDispView(text) {
    maxItem = jsonData.dispositionCount;
    if (jsonData.dispositions !== null) {
        if (!($$(text).hasClass('disposition-get'))) {
            tBefore = performance.now();
            var dispositionLists = '<ul>';
            for (var i = 0; i < /*19*/ jsonData.dispositions.length; i++) {
                var data = jsonData.dispositions[i];
                dispositionLists +=
                    '<li>' +
                    '   <a href=' + ((data.mail.type === "surat") ? "mail-details.html" : "memo-details.html") + ' data-id="' + data.id + '"class="item-link item-content disp-detail' +
                    ((text == '.disposition-in-list' && data.status !== "Read") ? ' unread' : '') +
                    '" data-view=".view-main">' +
                    '       <div class="item-media">' +
                    '           <img style="border-radius: 50%" src="http://lorempixel.com/160/160/people/' + (i % 10) + '/" width="80" class="lazy" />' +
                    '       </div>' +
                    '       <div class="item-inner">' +
                    '           <div class="item-title-row">' +
                    '               <div class="item-title">' + data.person + ((data.personType !== "Tujuan") ? ' <span class="badge bg-lightblue">' + data.personType + '</span>' : '') + '</div>' +
                    '               <div class="item-after">' + ((data.mail.attachment === true) ? '<i class="material-icons">&#xE2BC;</i>' : '') + data.date + '</div>' +
                    '           </div>' +
                    '           <div class="item-subtitle"><span class="badge bg-' + data.property.color + '">' + data.property.name + '</span>' + data.mail.subject + '</div>' +
                    '           <div class="item-text">' + data.mail.content + '</div>' +
                    '       </div>' +
                    '   </a>' +
                    '</li>';
            }
            dispositionLists += '</ul>';
            tAfter = performance.now();
            console.log("get surat list time (ms) = ");
            console.log(tAfter - tBefore);
            $$(text).append(dispositionLists);
        } else {
            $$(text).removeClass('disposition-get');
        }
    } else {
        myApp.alert('Tidak ada disposisi untuk nama pengguna "' + UserName + '"', 'InEMS');
    }
    $$(text).addClass('disposition-get');
}

function createNextDispView(index, text) {
    var itemsToLoad = 20;
    var next = index + itemsToLoad;
    if (loading) return;
    loading = true;
    setTimeout(function() {
        loading = false;
        var html = '';
        var peak = (next >= maxItem) ? (maxItem - 1) : next;
        for (var i = index; i <= peak; i++) {
            var personType = '';
            var DispositionLists = jsonData.dispositions[i];
            var pageLink = (DispositionLists.mail.type === "surat") ? "mail-details.html" : "memo-details.html";
            html +=
                '<li>' +
                '   <a href=' + pageLink + ' data-id="' + DispositionLists.id + '"class="item-link item-content disp-detail';
            if (text == '.disposition-in-list' && DispositionLists.status !== "Read") {
                html += ' unread';
            }
            if (DispositionLists.personType !== "Tujuan") {
                personType = ' <span class="badge bg-lightblue">' + DispositionLists.personType + '</span>';
            }
            var attachment = (DispositionLists.mail.attachment === true) ? '<i class="material-icons">&#xE2BC;</i>' : '';
            html +=
                '" data-view=".view-main">' +
                '       <div class="item-media">' +
                '           <img style="border-radius: 50%" src="http://lorempixel.com/160/160/people/' + (i % 10) + '/" width="80" class="lazy" />' +
                '       </div>' +
                '       <div class="item-inner">' +
                '           <div class="item-title-row">' +
                '               <div class="item-title">' + DispositionLists.person + personType + '</div>' +
                '               <div class="item-after">' + attachment + DispositionLists.date + '</div>' +
                '           </div>' +
                '           <div class="item-subtitle"><span class="badge bg-' + DispositionLists.property.color + '">' + DispositionLists.property.name + '</span>' + DispositionLists.mail.subject + '</div>' +
                '           <div class="item-text">' + DispositionLists.mail.content + '</div>' +
                '       </div>' +
                '   </a>' +
                '</li>';
        }
        $$('.view-main').find('.list-block ul').append(html);
        if (next >= maxItem) {
            myApp.detachInfiniteScroll('.infinite-scroll');
            $$('.infinite-scroll-preloader').remove();
            return;
        }
    }, 500);
}

function createDispositionOutListItems(data) {
    jsonDataGet = JSON.parse(data);
    jsonData = jsonDataGet;
    createDispView('.disposition-out-list');
}

function createDispositionDetailsItem(data) {
    tBefore = performance.now();
    var containerParent = $$('.disp-details');
    if (!(containerParent.hasClass('disp-detail-get'))) {
        var jsonData = JSON.parse(data);
        var attachment = (jsonData.mail.attachment === null) ? "tidak ada lampiran" : jsonData.mail.attachment;
        var dispDetails =
            '<div class="content-block-title">Informasi Pengirim</div>' +
            '<div class="list-block media-list">' +
            '       <ul>' +
            '           <li>' +
            '               <div class="item-content">' +
            '                   <div class="item-media"><img style="border-radius: 50%" data-src="http://lorempixel.com/160/160/people/1" width="80" class="lazy lazy-fadein" /></div>' +
            '                   <div class="item-inner">' +
            '                       <div class="item-title-row">' +
            '                           <div class="item-title">' + jsonData.person.name + '</div>' +
            '                       </div>' +
            '                       <div class="item-subtitle">' + jsonData.person.title + '</div>' +
            '                       <div class="item-text">' + jsonData.date + '</div>' +
            '                   </div>' +
            '               </div>' +
            '           </li>' +
            '       </ul>' +
            '</div>' +
            '<div class="content-block-title">Informasi ' + jsonData.mail.type + ' <span class="color-red">(' + jsonData.personType + ')</span></div>' +
            '<div class="list-block">' +
            '   <ul>' +
            '       <li>' +
            '           <div class="item-content">' +
            '               <div class="item-inner row">' +
            '                   <div class="item-title col-40">Perihal</div>' +
            '                   <div class="item-after col-60">' + jsonData.mail.subject + '</div>' +
            '               </div>' +
            '           </div>' +
            '       </li>' +
            '       <li>' +
            '           <div class="item-content">' +
            '               <div class="item-inner row">' +
            '                   <div class="item-title col-40">Sifat</div>' +
            '                   <div class="item-after col-60">' + jsonData.property.name + '</div>' +
            '               </div>' +
            '           </div>' +
            '       </li>' +
            '       <li>' +
            '           <div class="item-content">' +
            '               <div class="item-inner row">' +
            '                   <div class="item-title col-40">Isi</div>' +
            '                   <div class="item-after col-60">' + jsonData.mail.content + '</div>' +
            '               </div>' +
            '           </div>' +
            '       </li>' +
            '       <li>' +
            '           <div class="item-content">' +
            '               <div class="item-inner row">' +
            '                   <div class="item-title col-40">Lampiran</div>' +
            '                   <div class="item-after col-60">' + attachment + '</div>' +
            '               </div>' +
            '           </div>' +
            '       </li>' +
            '       <li>' +
            '           <div class="item-content">' +
            '               <div class="item-inner row">' +
            '                   <div class="item-title col-40">Status</div>' +
            '                   <div class="item-after col-60">' + jsonData.status + '</div>' +
            '               </div>' +
            '           </div>' +
            '       </li>' +
            '   </ul>' +
            '</div>';
        containerParent.append(dispDetails);
        var tabActions =
            '<a href="disp-form.html" data-id="' + jsonData.mail.id + '" class="get-mail-id link" data-force="true">' +
            '   <i class="material-icons">&#xE146;</i>' +
            '</a>';
        if (jsonData.mail.attachment !== null) {
            tabActions +=
                '<a href="#" class="link download-file" data-name="' + jsonData.mail.attachment + '">' +
                '   <i class="material-icons">&#xE2C4;</i>' +
                '</a>';
        }
        $$('.tab-action').append(tabActions);
    } else {
        containerParent.removeClass('disp-detail-get');
    }
    containerParent.addClass('disp-detail-get');
    tAfter = performance.now();
    console.log("get surat details time (ms) = ");
    console.log(tAfter - tBefore);
}
