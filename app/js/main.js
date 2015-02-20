var PR = {

    init: function () {
        PR.Video.init();
    },

    getAllElem: $('.get-all'),

    Video: {

        init: function () {

            $('.disabled').on('click', function () { return false; });

            PR.Video.getAll(PR.getAllElem.first().attr('data-playlist-id'), false);

            PR.getAllElem.on('click', function(){
                PR.Video.getAll($(this).attr('data-playlist-id'), true);
                return false;
            });

            $(document).on('click', '.video-list-item', function () {
                $('.black-bg').fadeIn();
                var th      = $(this),
                    id      = th.attr('data-video-id'),
                    title   = th.find('.video-title').attr('data-feed-title');
                PR.Video.createVideo(id, title, true);
                return false;
            });

        },

        getAll: function (playListID, autoPlay) {

            if (!PR.getAllElem.hasClass('disabled')) {

                PR.getAllElem.addClass('disabled');

                // Playlist
                var playListURL = 'http://gdata.youtube.com/feeds/api/playlists/' + playListID + '?v=2&alt=json&callback=?',
                    embedURL    = 'http://www.youtube.com/embed/';

                $.getJSON(playListURL, function (data) {

                    var list_data = "";

                    for(var i in data.feed.entry){

                          var item        = data.feed.entry[i],
                              feedTitle   = item.title.$t,
                              feedURL     = item.link[1].href,
                              viewCount   = PR.Video.slice(Number(item.yt$statistics != undefined && item.yt$statistics.viewCount != undefined ? item.yt$statistics.viewCount : 0)),
                              fragments   = feedURL.split("/"),
                              videoID     = fragments[fragments.length - 2],
                              url         = embedURL + videoID,
                              thumb       = "http://img.youtube.com/vi/" + videoID + "/default.jpg";

                              list_data += '<li class="video-list-item" data-video-id="'+videoID+'">' +
                                              '<div class="related-video-box">' +
                                                  '<span class="thumb-wrap">' +
                                                      '<img src="'+thumb+'" alt=\''+feedTitle+'\'/>' +
                                                  '</span>' +
                                                  '<span class="video-text-area">' +
                                                      '<span data-feed-title=\''+feedTitle+'\' class="video-title">'+feedTitle+'</span>' +
                                                      '<span class="video-cat-title"></span>' +
                                                      '<span class="view-count">'+viewCount+'</span>' +
                                                  '</span>' +
                                               '</div>' +
                                         '</li>';

                    }

                    var contentArea =  $('#contentArea');
                        contentArea.empty().append(list_data);

                    var firstItem       = $('.video-list-item:first'),
                        firstItemID     = firstItem.attr('data-video-id'),
                        firstItemTitle  = firstItem.find('.video-title').attr('data-feed-title');

                    PR.Video.createVideo(firstItemID, firstItemTitle, autoPlay);
                    PR.getAllElem.removeClass('disabled');

                });
            }

        },

        createVideo: function (videoID, firstItemTitle, autoPlay) {

            var auto_play    = autoPlay ? '?autoplay=1' : '',
                embedURL     = 'http://www.youtube.com/embed/' + videoID + auto_play + '';
            $('#playerWrapper h2').html(firstItemTitle).siblings('iframe').attr('src', embedURL).siblings('.black-bg').hide();
            return false;

        },

        slice: function (viewCount) {

            var view_count  = JSON.stringify(viewCount),
                sep         = '.',
                len         = view_count.length,
                numberArr   = '';

            if (len > 3) {

                for (var i = 0; i < len; i = i + 3) {
                    numberArr += view_count.slice(i, i + 3) + sep;
                }

                var newLength = numberArr.length;
                    numberArr = numberArr.slice(0, newLength - 1) + ' Visited';

            } else {
                numberArr = view_count;
            }

            return numberArr;

        }

    }
};

$(window).load(PR.init());

// Yedek - var playListURL = 'http://gdata.youtube.com/feeds/api/users/UCdE6PZoEw-T3hDamPq6Z_0g?v=2.1&alt=json';




