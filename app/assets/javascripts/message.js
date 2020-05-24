$(function () {
  function buildHTML(message) {
    // 画像・テキストの変数
    var image = message.image ? `<img src=${message.image} class='main__chats__chat__bottom__image'>` : "";
    var text = message.message ? `<p class="main__chats__chat__text__comment">${message.message}</p>` : "";

    // htmlの変数
    var html = `<div class="main__chats__chat" data-message-id=${message.id}>
                  <div class="main__chats__chat__upper">
                    <div class="main__chats__chat__upper__talker">${message.user_name}</div>
                    <div class="main__chats__chat__upper__date">${message.created_at}</div>
                  </div>
                  <div class='main__chats__chat__bottom'>
                    ${text}
                    ${image}
                  </div>
                </div>`;
    return html;
  }

  // メッセージの非同期投稿の関数
  $("#new_message").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr("action");

    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false
    })
      .done(function (data) {
        var html = buildHTML(data);
        $(".main__chats").append(html)
        $(".main__chats").animate({ scrollTop: $(".main__chats")[0].scrollHeight });
        $("form")[0].reset();
        $(".submit-save").removeAttr("disabled");
      })
      .fail(function () {
        alert("メッセージ送信に失敗しました");
      });
  });

  // 自動更新の関数
  var reloadChats = function () {
    var last_message_id = $(".main__chats__chat:last").data("message-id");
    var group_id = $(".main__header__leftbox__groupname").data("group-id")

    $.ajax({
      url: `/groups/${group_id}/api/messages`,
      type: "get",
      dataType: "json",
      data: { last_message_id: last_message_id }
    })
    .done(function (messages) {
      if (messages.length !== 0) {
        var insertHTML = "";
        $.each(messages, function (i, message) {
          insertHTML += buildHTML(message);
        });
        $(".main__chats").append(insertHTML);
        $(".main__chats").animate({ scrollTop: $(".main__chats")[0].scrollHeight });
      }
    })
    .fail(function () {
      alert("error");
    });
  };

  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadChats, 7000);
  }
});