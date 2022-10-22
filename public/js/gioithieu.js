$("#nhangioithieu").click(() => {
    const code = $("#maGt").val()
    const sdt = $("#sdtNhanQua").val()
    $.ajax({
        url: '/nhapCodeGioiThieu',
        data: { sdt: sdt,code:code },
        type: 'POST',
        beforeSend(xhr) {
            $('#nhangioithieu').text('Đang kiểm tra vui lòng chờ');

            $('#nhangioithieu').prop('disabled', true);

            $("#alerttt-gioithieu").html("")
        },
        complete(xhr, status) {
            $('#nhangioithieu').text('Nhận thưởng ngay');
            $('#nhangioithieu').prop('disabled', false);

        },
        success: function (d) {
            if (!d.error) {
                $("#alerttt-gioithieu").html(`<div class="alert alert-success alert-dismissable">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                <strong>Thành công </strong> ${d.message}.
              </div>`)
            }
            else {
                $("#alerttt-gioithieu").html(`<div class="alert alert-danger alert-dismissable">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                <strong>Lỗi!</strong> ${d.message}.
              </div>`)
            }
        }
    })
})
$("#btnGetCode").click(() => {
    const sdt = $("#inputSDTcode").val()
    $.ajax({
        url: '/getCodeGioiThieu',
        data: { sdt: sdt },
        type: 'POST',
        beforeSend(xhr) {
            $("#alert-nhanqua").html("")
        },
        complete(xhr, status) {

        },
        success: function (d) {
            if (!d.error) {
                $("#alert-nhanqua").html(`<div class="alert alert-success alert-dismissable">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                Mời bạn bè nhập mã này để nhận 100k nhé
                <br/>

                <strong>Mã của bạn là:</strong> <b style="color:red">${d.data.code}</b> <span class="label label-success text-uppercase" onclick="copyTextToClipboard('${d.data.code}')"><i class="fa fa-clipboard" aria-hidden="true"></i></span>
                <br/>

                <strong>Link chia sẽ của bạn:</strong> <b style="color:red"><a href="#">https://azmomo.vip/gt/${d.data.code}</a></b>  <span class="label label-success text-uppercase" onclick="copyTextToClipboard('https://azmomo.vip/gt/${d.data.code}')"><i class="fa fa-clipboard" aria-hidden="true"></i></span>

              </div>`)
            }
            else {
                $("#alert-nhanqua").html(`<div class="alert alert-danger alert-dismissable">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                <strong>Lỗi!</strong> ${d.message}.
              </div>`)
            }
        }
    })
})


function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';


      alert("Đã sao chép " + text)

     // console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        alert("copy lỗi ")
    }
  
    document.body.removeChild(textArea);
  }
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        alert("Đã sao chép " + text)
    }, function (err) {
        alert("copy lỗi ")
    });
}