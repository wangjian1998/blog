//注册
var flag = false;

//点击注册
$(function () {
    $('#register').click(function () {
        var nameval = $('#auth_code').val();
        var passval = $('#password').val();
        var confirm = $('#confirm_pass').val();
        if (vailPhone()) {
            if (nameval == '' || nameval == null) {
                $('#tip').text('请输入验证码');
            } else if (passval.length < 6) {
                $('#tip').text('输入的密码长度小于6');
            } else if (confirm !== passval) {
                $('#tip').text('两次密码不一致')
            } else {
                $('#tip').text('');
                window.location.href = './dashboard.html';
            }
        }
    })
 //点击获取验证码
$('#yanzheng').click(function () {
    if (vailPhone()) {
        console.log('1111');
    } else {
        console.log('3333')
        return;
    }
    console.log('22222')
})

//登录
$('#login').click(function (evt) {
    evt.preventDefault();
    $.ajax({
        url: 'http://blog2019.applinzi.com/api/login',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            "username": $('#username').val(),
            "password": $('#password').val()
        }),
        // dataType:"json",
        success: function (data) {

            debugger;
            if (data.authenticated) {
                console.log(data);
                location.href = "./index.html";
            } else {
                location.reload();
            }
        },
        error: function (error) {
            debugger;
            console.log(error);
        }
    });
});

// 主页

//主页导航条
$('#nav li').click(function () {
    $('.main').children().eq($(this).index()).addClass('dis-blo').siblings().removeClass('dis-blo');
})

//获取列表
$.ajax({
    url: 'http://blog2019.applinzi.com/api/blogs',
    type: 'GET',
    contentType: "application/json",
    success: function (data) {
        var html = '';
        console.log(data);
        for (i = 0; i < data.length; i++) {
            html += '<div class="panel panel-primary">' +
                ' <div class="panel-heading">' + data[i].blogText +
                '<div class="f-r">' + getMyDate(Number(data[i].date)) + '</div>' + '</div>' +
                ' <div class="panel-body"  id = "details">' + '<a href = "./Details.html?id=' + data[i]._id + '" target = "_blank">' + data[i].introText + '</a>' + '</div>' +
                '<div class="panel-footer">' + getCategoryNameById(data[i].languageId) + '</div>' + '</div>'
        }
        $('.post-wrapper').html(html);
    },
    error: function (error) {
        debugger;
        console.log(error);
    }
});

//新建文章

$('#new_project').click(function (evt) {
    var data1 = {
        "blogText": $('#blog_Text').val(),
        "introText": $('#intro_Text').val(),
        "languageId": $('#language option:selected').val()
    }
    evt.preventDefault();
    var blogId = (new Date()).getTime();
    $.ajax({
        url: 'http://blog2019.applinzi.com/api/blog/' + blogId,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(data1),
        success: function (data) {
            location.reload();
        },
        error: function (error) {
            debugger;
            console.log(error);
        }
    });
});





//博客详情
$.ajax({
    url: 'http://blog2019.applinzi.com/api/blog/' + GetRequest('id'),
    type: 'GET',
    contentType: "application/json",
    success: function (data) {
        debugger;
        console.log(data);
        html = '';
       
        html += '<h3 class = "title">' + '博客标题：' + data.introText + '</h3>' +
            '<div class = "time">' + '创建时间：' + getMyDate(Number(data.date)) + '</div>' +
            '<div class = "content">' + data.blogText + "</div>"+
            '<h3 class = "title">'+'博客评论'+'</h3>'+
            '<ul class="list-group">' 
            for(var i = 0; i < data.comments.length;i ++){
                html += ' <li class="list-group-item">'+data.comments[i].commentText+'</li>'
           }
           html+='</ul>'
        $('.empty-wrapper').html(html);
    },
    error: function (error) {
        debugger;
        console.log(error);
    }
});

//获取当前评论
$('#publish').click(function(){
    $.ajax({
        url: 'http://blog2019.applinzi.com/api/comment/commentId',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            'commentText': $('#commentText').val(),
            "blog": GetRequest('id')
        }),
        success: function (data) {
            console.log(data);
            window.location.reload();
        },
        error: function (error) {
            debugger;
            console.log(error);
        }
    });
})
})





//获取地址栏里（URL）传递的参数 

function GetRequest(value) {
    var url1 = '?id="123456"&Name="bicycle"'
    var url = decodeURI(location.search); //?id="123456"&Name="bicycle";
    var object = {};
    if (url.indexOf("?") != -1)//url中存在问号，也就说有参数。 
    {
        var str = url.substr(1); //得到?后面的字符串
        var strs = str.split("&"); //将得到的参数分隔成数组[id="123456",Name="bicycle"];
        for (var i = 0; i < strs.length; i++) {
            object[strs[i].split("=")[0]] = strs[i].split("=")[1]
        }
    }

    return object[value];
}

//验证手机号方法
function vailPhone() {
    var phone = $("#phone").val();
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;

    if (phone == '') {
        $('#tip').text('手机号码不能为空！');
        flag = false;
    } else if (phone.length != 11) {
        $('#tip').text('请输入有效的手机号码！！');
        flag = false;
    } else if (!myreg.test(phone)) {
        $('#tip').text('请输入有效的手机号码！！');
        flag = false;
    } else {
        $('#tip').text('');
        flag = true;
    }
    return flag;
}

//时间戳变为时间
function getMyDate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' +
            getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
    return oTime;
};
//补0操作
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}

// option显示数据
var categoryList = [
    { id: 1, name: "前端" },
    { id: 2, name: "后台" },
    { id: 3, name: 'UI' },
    { id: 4, name: '小程序' },
    { id: 5, name: '服务器' }
];
function getCategoryNameById(id) {
    var categoryName = '';
    for (var i = 0; i < categoryList.length; i++) {
        if (categoryList[i].id == id) {
            categoryName = categoryList[i].name;
        }
    }
    return categoryName;
}









