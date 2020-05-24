$(function () {
  function buildHTML(message) {
    
    var image = message.image ? `<img src=${message.image}>` : "";

    var text = message.message ? `
    <div class="main__chats__chat__text">
      <p class="main__chats__chat__text__comment">${message.message}</p>
    </div>` : "";

    var html = `<div class="main__chats__chat" data-message-id=${message.id}>
          <div class="main__chats__chat__upper">
            <div class="main__chats__chat__upper__talker">${message.user_name}</div>
            <div class="main__chats__chat__upper__date">${message.created_at}</div>
          </div>
          ${text}
          ${image}
        </div>`;
    return html;
  }

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

  $("#new_message").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr("action");

    $(".main__form__box__submit").removeAttr("data-disable-with");
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
      })
      .fail(function () {
        alert("メッセージ送信に失敗しました");
      });
  });

  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadChats, 7000);
  }
});