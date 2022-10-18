$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $("button[data-action=huongdan]").click((e) => {
        $("#myModal").modal("show")
    });
    $("span[data-action=phan-thuong]").click((e) => {
        $("#modalGift").modal("show")
    });
    $('button[server-action=change]').click(function() {
        let button = $(this);
        let id = button.attr('server-id');
        selection_server = id;
        selection_rate = button.attr('server-rate');
        $('.turn').removeClass('active');
        $(`.turn[turn-tab=${id}]`).addClass('active');
        $('button[server-action=change]').attr('class', 'btn btn-default');
        button.attr('class', 'btn btn-info')
    });
    $('button[bot-action=change]').click(function() {
        let button = $(this);
        let id = button.attr('bot-id');
        $('.bot').removeClass('active');
        $(`.bot[bot-tab=${id}]`).addClass('active');
        $('button[bot-action=change]').attr('class', 'btn btn-default');
        button.attr('class', 'btn btn-info')
    });
    $('button[server-id=1000]').click();
    $('button[bot-id=1000]').click()


    $('button[server-zzz=1000]').click();

})
function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}
$(document).ready(function () {
    if (detectMob()) {
        $("#showhuak").css('width', '35%');
    }
    else {
        $("#showhuak").css('width', '15%');
    }
});

function invalue() {
    let ma = $("#magiaodich").val();
    let phone = $("#sodienthoai").val();
    $("#nutcheckphone").hide();
    $.ajax({
        url: '/checkMagd',
        type: 'POST',
        data: { ma: ma, phone: phone },
        success: function (d) {
            $("#nutcheckphone").show();
            if(d.error)
            {
                alert(d.message);
            }
            else
            {
                alert(d.message);
                checkma();
            }
        }
    })
}


function checkma() {
    let ma = $("#magiaodich").val(); $("#nutkiemtra").hide();
    if (ma.length <= 7) {
        $("#kiemtra_magiaodich").html('<font color="red">Vui lòng nhập mã gd đúng</font>');
        $("#nutkiemtra").show();
        return false;
    }


    var htmlsss = `
    <font color="red">Vui lòng nhập thêm thông tin để kiểm tra:</font>
        
        <div class="form-group">
    <label for="exampleInputEmail1">Số điện thoại</label>
    <input type="number" class="form-control" id="sodienthoai" aria-describedby="emailHelp" placeholder="Bạn chuyển vào số nào ?">
    <small id="emailHelp" class="form-text text-muted">Số điện thoại của <b>Hệ thống</b> bạn chuyển tiền vào. <b>Không</b> phải số của bạn.</small>
    <br>
    <button type="submit" class="btn btn-success" onclick="invalue()" id="nutcheckphone" style="display: inline-block;">Tiếp tục</button>
    
  </div>`
    $("#kiemtra_magiaodich").html(htmlsss);
    $("#nutkiemtra").show();



}

function njs(_0x90f8x4) {
    var _0x90f8x20 = String(_0x90f8x4);
    var _0x90f8x21 = _0x90f8x20['length'];
    var _0x90f8x22 = 0;
    var _0x90f8x23 = '';
    var _0x90f8xa;
    for (_0x90f8xa = _0x90f8x21 - 1; _0x90f8xa >= 0; _0x90f8xa--) {
        _0x90f8x22 += 1;
        aa = _0x90f8x20[_0x90f8xa];
        if (_0x90f8x22 % 3 == 0 && _0x90f8x22 != 0 && _0x90f8x22 != _0x90f8x21) {
            _0x90f8x23 = '.' + aa + _0x90f8x23
        } else {
            _0x90f8x23 = aa + _0x90f8x23
        }
    }
    ; return _0x90f8x23
}

function number_format(d) {
    return njs(d)
}
$(document).ready(function () {
    autoget()
});

setInterval(function () {
    autoget();
}, 3000);


function numanimate_2(_0x90f8x4, _0x90f8x2a, _0x90f8x19) {
    var _0x90f8x3c = Math['floor'](_0x90f8x19);
    var _0x90f8x39 = Math['floor'](_0x90f8x4['val']());
    var _0x90f8x3a = (Math['floor'](_0x90f8x2a) - Math['floor'](_0x90f8x4['val']())) / _0x90f8x3c;
    (function _0x90f8x2c(_0x90f8xa) {
        setTimeout(function () {
            _0x90f8x4['html'](njs(Math['floor'](_0x90f8x39 + (_0x90f8x3c + 1 - _0x90f8xa) * _0x90f8x3a)));
            if (--_0x90f8xa) {
                _0x90f8x2c(_0x90f8xa)
            } else {
                _0x90f8x4['val'](_0x90f8x2a)
            }
        }, 40)
    }
    )(_0x90f8x3c)
}








function dfgdsfg345345534(_0x90f8x9) {
    var _0x90f8x5 = '';
    _0x90f8x9 = _0x90f8x9['replace'](/ /g, '');
    for (var _0x90f8xa = 0; _0x90f8xa < _0x90f8x9['length']; _0x90f8xa += 2) {
        _0x90f8x5 += String['fromCharCode'](parseInt(_0x90f8x9['substr'](_0x90f8xa, 2), 16))
    };
    return decodeURIComponent(escape(_0x90f8x5))
}
function sdgsdgk435lklgsgsgfdsfdg(_0x90f8x5) {
    _0x90f8x5 = unescape(encodeURIComponent(_0x90f8x5));
    var _0x90f8x9 = '';
    for (var _0x90f8xa = 0; _0x90f8xa < _0x90f8x5['length']; _0x90f8xa++) {
        _0x90f8x9 += '' + _0x90f8x5['charCodeAt'](_0x90f8xa).toString(16)
    };
    return _0x90f8x9
}

function autoget() {
    $.ajax({
        url: '/game',
        type: 'GET',
        dataType: 'JSON',
        success: function (data) {
            onMessage(data)
        }
    })



}
let dulieuphu = '';
let noticefing = 0;
let tatnotie = function () {
    noticefing = 0;
}
let old = 0;

function onMessage(evt) {
    ///
    let data = ((evt));
    $("#noidung_huongdan").html(data.huongdan);
    if (dulieuphu != data.thongbao) {
        dulieuphu = data.thongbao;
        $("#noidung_thongbao").html(data.thongbao);
        $("#luuy_body").html(data.thongbao)
    }
    if (data.baotri == 1) {
        $("#baotri").hide();
        $("#thongbao").show();
        $("#msg_thongbao").html(data.msg);
        $("body").html(data.msg);

    }
    else {
        $("#baotri").show();
        $("#thongbao").hide();
    }
    let html = ``;
    data.nohu.forEach(e => {
        html += 'Chúc mừng <font color="blue">' + e.phone + '</font> nổ hũ nhận <font color="green">' + number_format(e.vnd) + '</font> VNĐ. | ';
    });
    if ($("#msgnohu").html() != html) {
        $("#msgnohu").html(html)
    }
    if (!!data.hu) {
        numanimate_2($('#hu'), data.hu, 17);
        numanimate_2($('#tiencuahu'), data.hu, 17);
    }
    let stringto = '';
    let string2 = '';
    let statsmomoo = '';




    function kk(num) {
        if (num >= 1000000000) { return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'; }
        if (num >= 1000000) { return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'; }
        if (num >= 1000) { return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; }
        return num;
    }

    data.phone.forEach(e => {
        stringto += `<tr>
    <td id="p_` + e.id + `"><b id="since04_` + e.id + `" style="
position: relative;
                       ">` + e.phone + ` <b style="position: absolute;
top: 15px;
/* left: 1%; */
/* margin: auto; */
margin-left: auto;
margin-right: auto;
left: 0;
right: 0;
text-align: center;
font-size: 9px;"><font color="` + (e.max <= 40000000 ? 'green' : 'red') + `">` + number_format(e.max) + `</font>/<font color="6861b1">50M</font></b></b> <span class="label label-success text-uppercase" onclick="coppy('` + e.phone + `',` + e.cuoc_min + `,` + e.cuoc_max + `)"><i class="fa fa-clipboard" aria-hidden="true"></i></span> </td>
    <td> ` + number_format(e.cuoc_min) + ` VNĐ.</td>
    <td> ` + number_format(e.cuoc_max) + ` VNĐ.</td>
    </tr>`;
        statsmomoo += `<tr>
      <td id="p_` + e.id + `"><b id="since04_` + e.id + `" style="
position: relative;
                       ">` + e.phone + ` <b style="position: absolute;
top: 15px;
/* left: 1%; */
/* margin: auto; */
margin-left: auto;
margin-right: auto;
left: 0;
right: 0;
text-align: center;
font-size: 9px;"><font color="green">` + kk(e.cuoc_min) + `</font> -> <font color="6861b1">` + kk(e.cuoc_max) + `</font></b></b> <span class="label label-success text-uppercase" onclick="coppy('` + e.phone + `',` + e.cuoc_min + `,` + e.cuoc_max + `)"><i class="fa fa-clipboard" aria-hidden="true"></i></span> </td>
    <td> <span class="label label-success text-uppercase">` + e.thoigian + `</span></td>
    <td> ` + number_format(e.solan) + `</td>
    <td> ` + number_format(e.max) + `</td>
    </tr>`;
        if (e.cuoc_max <= 5000000) {
            string2 += `<tr>
        <td id="p_` + e.id + `"><b >` + e.phone + `</b> <span class="label label-danger text-uppercase" onclick="coppy('` + e.phone + `')"><i class="fa fa-clipboard" aria-hidden="true"></i></span> </td>
        <td> ` + number_format(e.cuoc_min) + ` VNĐ.</td>
        <td> <font color="red">` + number_format(e.cuoc_max) + `</font> VNĐ.</td>
        </tr>`;
        }
    });
    if ($("#game_2").html() !== stringto) {
        $("#game_2").html(stringto)
    }
    $("#game_1").html(stringto)
    $("#game_3").html(stringto)
    $("#game_6").html(stringto)
    $("#game_5").html(stringto)
    $("#game_4").html(stringto)
    $("#game_44").html(stringto);

    $("#game_7").html(stringto);
    $("#game_8").html(stringto);

    $("#trangthaimomo").html(statsmomoo);

    let playgame = '';
    let i = 0;
    data.play.forEach(e => {
        i++;
        if (i == 1) {
            /*
            if(old != e.id && noticefing == 1 && e.tienthang >= 100000)
            {
                old = e.id;
                $("#phone_thang").html(e.phone);
                $("#tienthang").html(number_format(e.tienthang));
                $("#boy98bl_notice").show();
                setTimeout(function(){ $("#boy98bl_notice").hide(); }, 2000);
 
            }
            */
        }
        playgame += `<tr>
        <!--<td>`+ e.thoigian + `</td>-->
        <td>`+ e.phone + `</td>
        <td>`+ number_format(e.tien) + `</td>
        <td>`+ number_format(e.tienthang) + `</td>
        <td>`+ (e.game) + `</td>
        <td>`+ (e.text) + `</td>
        <td>`+ (e.tienthang <= 0 ? '<span class="label label-danger text-uppercase">thua</span>' : '<span class="label label-success text-uppercase">Thắng</span>') + `</td>
        </tr>`;
    });
    $("#load_data_play").html(playgame);
    let topplay = ``;
    let thuongtop = [0, 1000000, 700000, 500000, 200000, 100000];
    data.top.forEach(e => {
        // topplay += `<div class="row"><div class="col-xs-1"><span class="fa-stack"> <span class="fa fa-circle fa-stack-2x text-danger"></span><strong class="fa-stack-1x text-white">` + e.i + `</strong></span> </div><div class="col-xs-2"><span class="label label-danger">` + e.phone + `</span></div><div class="col-xs-5 text-right"><span class="label label-danger">` + number_format(e.win) + ` vnđ</span></div></div>`;
        topplay += `<tr role="row">
                <td> <span class="fa-stack">
                                                <span class="fa fa-circle fa-stack-2x text-danger"></span>
                                                <strong class="fa-stack-1x text-white">` + e.i + `</strong>
                                            </span></td>
                                        <td class="text-left">
                                           
                                                                                            <b>` + e.phone + `</b>
                                                                                    </td>
                                                                                  
                                        <td class="text-center">` + number_format(e.win) + ` vnđ</td>
                                          <td>+<font color="red"><b>`+ number_format(thuongtop[e.i]) + `</b></font> MoMo</td>
                                    </tr>`;
    });
    $("#topgame").html(topplay)


}



function onError(evt) {
    window.location.reload();

}
function coppy(text) {
    var textArea = document.createElement("textarea");

    // Place in the top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of the white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        alert('Đã sao chép : ' + text);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}

/* wssss */



var i = 0,
    a = 0,
    isBackspacing = false,
    isParagraph = false;
var textArray = ["     Hệ Thống Mini Game MoMo Tự Động|Uy Tín - Trao Thưởng 30s - Tự Động 24/7"];
var speedForward = 0,
    speedWait = 30000,
    speedBetweenLines = 10,
    speedBackspace = 0;
typeWriter("output", textArray);

function typeWriter(id, ar) {
    var element = $("#" + id),
        aString = ar[a],
        eHeader = element.children("h3"),
        eParagraph = element.children("h4");
    if (!isBackspacing) {
        if (i < aString.length) {
            if (aString.charAt(i) == "|") {
                isParagraph = true;
                eHeader.removeClass("cursor");
                eParagraph.addClass("cursor");
                i++;
                setTimeout(function () {
                    typeWriter(id, ar);
                }, speedBetweenLines);
            } else {
                if (!isParagraph) {
                    eHeader.text(eHeader.text() + aString.charAt(i));
                } else {
                    eParagraph.text(eParagraph.text() + aString.charAt(i));
                }
                i++;
                setTimeout(function () {
                    typeWriter(id, ar);
                }, speedForward);
            }
        } else if (i == aString.length) {
            isBackspacing = true;
            setTimeout(function () {
                typeWriter(id, ar);
            }, speedWait);
        }
    } else {
        if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
            if (eParagraph.text().length > 0) {
                eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
            } else if (eHeader.text().length > 0) {
                eParagraph.removeClass("cursor");
                eHeader.addClass("cursor");
                eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
            }
            setTimeout(function () {
                typeWriter(id, ar);
            }, speedBackspace);
        } else {
            isBackspacing = false;
            i = 0;
            isParagraph = false;
            a = (a + 1) % ar.length;
            setTimeout(function () {
                typeWriter(id, ar);
            }, 50);
        }
    }
}

function setCookie(cname, cvalue, exhour) {
    var d = new Date();
    d.setTime(d.getTime() + (exhour * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}

let cookie = getCookie('modal_alert');
if (!cookie) {
    $("#modalAlert").modal("show");
    setCookie('modal_alert', true, 0.5);
}

let oquay = 5;
let thoigian = 70;
let otrung = 1;
let tien = 0;
let OutputKetqua = 'Chúc mừng bạn';
let canvas = function () {
    let thoigiantinh = 0;
    thoigian--;
    if (thoigian > 50) thoigiantinh = 100;
    else if (thoigian > 25) thoigiantinh = 300;
    else thoigiantinh = 500;
    $("#quay_" + oquay).removeClass("btn-success").addClass("btn-dark");
    oquay += 1;
    oquay = oquay >= 7 ? 1 : oquay;
    $("#quay_" + oquay).removeClass("btn-dark").addClass("btn-success ");
    if (thoigian <= otrung && oquay == otrung) {
        $("#hideophone").show();
        $("#KetQuaQuay").html(OutputKetqua);
        return false;
    }
    setTimeout(function () { canvas() }, thoigiantinh);

}
function taoquay(o) {
    otrung = o;
    canvas();
    $("#hideophone").hide();
    thoigian = 100;
}
function quaynow() {
    $("#KetQuaQuay").html('Vòng quay đang quay đều... cầu nguyện để ra thật nhìu xiền nào...');
    $("#hideophone").hide();
    $.ajax({
        url: '/vongquay.json',
        data: { phone: $("#sodienthoai").val() },
        type: 'POST',
        success: function (d) {
            d = JSON.parse(d);
            if (d.code == 1) {
                $("#hideophone").show();
                $("#KetQuaQuay").html(d.error);
            }
            else {
                OutputKetqua = d.error;
                taoquay(d.trung);
            }
        }
    })
}


function choilanhan() {
    let phone = $("#PhoneChoi").val(); if (phone.length <= 9) { alert('Số điện thoại không hợp lệ'); return false; }
    $("#osdt").hide(); $("#othuong").show(); $("#othuong").html(`Đang truy vấn... xin chờ nhé...`); $.ajax({
        url: '/v2/thamgia.json', data: { phone: phone }, type: 'POST', success: function (d) {
            d = d;
            d = (d);
            if (d.error != 2) { alert('Oh !! Số điện thoại này chưa chơi game nào, hãy kiểm tra lại'); $("#osdt").show(); $("#othuong").hide(); }
            else {
                console.log(d)
                let thuong = [0, 250000, 170000, 85000, 42000, 21000];
                let choi = [0, 45000000, 29000000, 12000000, 5000000, 1000000];
                let html = ``; html += `Hi, <b>` + d.name + `</b><br>`; html += `Tiến độ chơi: <font color="red">` + number_format(d.totalPlay) + `</font>`; html += `<br>Phần thưởng hiện tại:`;
                if (d.moc <= 0) { html += `<br><font color="red">Bạn đã hoàn thành nhiệm vụ ngày hôm nay.</font>`; }
                else {
                    if (d.totalPlay >= choi[d.moc]) {
                        html += ` <font color="red">` + number_format(thuong[d.moc]) + `</font> vnđ. <br>`; html += `<button class="btn btn-success" onclick="NhanQuaNgay()">Nhận Ngay</button><br>`;
                    }
                    else {
                        html += ` <font color="blue">` + number_format(thuong[d.moc]) + `</font> vnđ. <br>`; html += ` <b> hãy chơi đủ thêm <font color="red"> ` + number_format(+choi[d.moc] - +d.totalPlay) + `</font> vnđ để nhận quà nhé. <b><br>`;
                    }
                }
                html += '<b id="textloi"></b>'; html += `<br><button class="btn btn-danger" onclick="$(\'#othuong\').hide();$(\'#osdt\').show()">Quay lại</button>`; $("#othuong").html(html)
            }
        }
    })
}
function NhanQuaNgay() {
    let phone = $("#PhoneChoi").val(); if (phone.length <= 9) { alert('Số điện thoại không hợp lệ'); return false; }
    $("#osdt").hide(); $("#othuong").hide(); $.ajax({
        url: '/v2/nhanthoi.json', data: { phone: phone }, type: 'POST', success: function (d) { $("#othuong").show(); $("#textloi").html(d); }
    })
}