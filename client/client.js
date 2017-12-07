
/**
 * 瞎写的，自执行函数
 */

!(function () {
    var d = document,
        w = window,
        dd = d.documentElement,
        db = d.body,
        dx = dd || db,
        ec = encodeURIComponent,
        p = parseInt,
        maleNameArr = ['本人','本胖子','Kevin','凡人','撩骚王','IT屌丝','单身汪','码农','大帅逼','我','在下'],
        femaleNameArr = ['本仙女','本菇凉','萌三岁','本萌妹','本小姐','小祖宗','女神','我','在下','女神经'],
        beforeName = ['帅过彭于晏的','正在减肥的','减肥失败的','正在填坑的','已经飞仙的','准备吃土的','抠搜儿的','直勾儿瞅你的','不想跟你说话的'],
        afterName = ['就是帅的一逼','智商欠费','很污很污...',':抢了辣条还想跑？','已经疯了','明天休假','不想理你',':闭嘴狗子!','准备挺尸一周','男神彭于晏','就是这么聪明','病的不轻','就是这么自信']
    w.sockInit = {
        msgObj: d.getElementById("message"),
        userName: '',
        userId: null,
        socket: null,
        titleHeight: d.getElementsByTagName('h1')[0].clientHeight,
        messageHeight: $('#message').height(),
        winHeight: null,
        sex: '',
        picUrl: '',
        logout: function () {
            // this.socket.disconnect();
            w.top.location.reload();
        },
        submit: function () {
            var content = d.getElementById('content').value;
            if (content != '') {
                var obj = {
                    userId: this.userId,
                    userName: this.userName,
                    sex: this.sex,
                    picUrl: this.picUrl,
                    content: content
                };
                //发送的信息和发送人组合成为对象
                this.socket.emit('message', obj);
                d.getElementById('content').value = '';
                $('#content').focus();
            }
            return false;
        },
        getWinHeight: function () {
            if (w.innerHeight) {
                winHeight = w.innerHeight;
            } else if ((d.body) && (d.body.clientHeight)) {
                winHeight = d.body.clientHeight;
            }
            // 通过深入 Document 内部对 body 进行检测，获取窗口大小
            if (d.documentElement && d.documentElement.clientHeight) {
                winHeight = d.documentElement.clientHeight;
            }
            return winHeight;
        },
        /**
         * 随机生成userid
         */
        getUserId: function () {
            return new Date().getTime() + "" + Math.floor(Math.random() * 99 + 1);
        },

        /**
         * 有新用户或者用户退出，提示。
         */

        updateSysMsg: function (o, action) {
            var onLineUsers = o.onLineUsers;
            var onLineCounts = o.onLineCounts;
            var user = o.user;
            // 插入在线人数和在线列表
            d.getElementById('onLineCounts').innerHTML = '当前共有' + onLineCounts + "个用户在线: ";
            //更新在线人数
            for (var key in onLineUsers) {
                if (onLineUsers.hasOwnProperty(key)) {
                    var span = d.createElement('span');
                    span.style.display = 'block';
                    span.style.padding = '10px';
                    span.innerHTML = onLineUsers[key];
                    d.getElementById('onLineCounts').appendChild(span);
                }
            }

            // 添加系统消息
            var html = '';
            html += '<div class="msg_system">';
            html += user.userName;
            html += (action === "login") ? "加入了群聊" : "退出了群聊";
            html += '</div>';
            var section = d.createElement('section');
            section.className = '';
            section.innerHTML = html;
            this.msgObj.appendChild(section);
        },

        /**
         * 用户提交用户名后，将login设置为不显示，将sockInit设置为显示
         */
        choose: function (ele,sex) {
            var borColorObj = {
                male: "5px solid rgba(2, 149, 255, 0.8)",
                female: "5px solid rgba(237, 3, 255, 0.8)",
            };
            $(ele).css('border', borColorObj[sex]).siblings('.rad').css('border-color', 'transparent');
            this.sex = sex;
        },
        rowName: function () {
            if(this.sex == ''){
                alert('请选择性别。。。');
                return false;
            }
            var malenameNum = Math.floor(Math.random() * maleNameArr.length);
            var femalenameNum = Math.floor(Math.random() * femaleNameArr.length);
            var beforeNum = Math.floor(Math.random() * beforeName.length);
            var afterNum = Math.floor(Math.random() * afterName.length);
            if(this.sex == 'male'){
                if (Math.floor(Math.random() * 2)){
                    this.userName = beforeName[beforeNum] + maleNameArr[malenameNum];
                }else{
                    this.userName = maleNameArr[malenameNum] + afterName[afterNum];
                }
            }else{
                if (Math.floor(Math.random() * 2)){
                    this.userName = beforeName[beforeNum] + femaleNameArr[femalenameNum];
                }else{
                    this.userName = femaleNameArr[femalenameNum] + afterName[afterNum];
                }
            }
            d.getElementById('userName').innerHTML = this.userName;
        },
        userNameSubmit: function () {
            if (this.sex == '') {
                alert('请选择性别。。。');
                return false;
            } else if(this.userName == ''){
                alert('请选择昵称。。。');
                return false;
            }else{
                d.getElementById('userName').value = '';
                d.getElementById('login').style.display = 'none';
                d.getElementById('signin').style.display = 'none';
                d.getElementById('sockInit').style.display = 'block';
                this.init(this.userName); //初始化
            }
        },
        setExpresTip: function(num,format,path) {
            var src = './img_gif/';
            var tem = '';
            var oDiv = $('.expreTip');
            for (var i = 0; i < num; i++){
                var r = i;
                if (path != '4800'&& i < 10){
                    r = '0' + i;
                }
                tem += '<span><img src=' + src  + path + '/' + r + '.' + format + ' /></span>';
            }
            oDiv.html(tem);
        },
        imgInit: function (num,format,path) {
                $('.expreTip').hide().html("");
                sockInit.setExpresTip(num,format,path);
                sockInit.expresClick(format,path);
                $('.expreTip').show();
        },
        //用户初始化
        init: function (userName) {
            var _this = this;
            var wBot = d.getElementsByClassName('input-box')[0];
            var wHeight = (_this.getWinHeight() - (this.titleHeight + wBot.clientHeight + 100)) + 'px';
            var rHeight = (_this.getWinHeight() - (this.titleHeight + 100)) + 'px';
            d.getElementById('message').style.height = wHeight;
            d.getElementById('onLineCounts').style.height = rHeight;
            //随机数生成uid
            this.userId = this.getUserId();
            if(this.sex == 'male'){
                this.picUrl = './headpic/pic' + Math.floor(Math.random() * 10) + '.jpg'
            }else{
                this.picUrl = './headpic/fpic' + Math.floor(Math.random() * 10) + '.jpg'
            }
            this.userName = userName;
            d.getElementById('showUserName').innerHTML = this.userName; //[newpidian]|[退出]
            //连接socketIO服务器,newpidian的IP地址
            this.socket = io.connect('127.0.0.1:3000');
            //向服务器发送某用户已经登录了
            this.socket.emit('login', {
                userId: this.userId,
                userName: this.userName
            });

            /**
             * 监听用户登录更新信息
             */

            this.socket.on('login', function (o) {
                //更新系统信息
                sockInit.updateSysMsg(o, 'login');
            });

            /**
             * 监听用户退出更新信息
             */

            this.socket.on('logout', function (o) {
                sockInit.updateSysMsg(o, 'logout');
            });

            /**
             * 监控用户发送信息
             */

            this.socket.on("message", function (obj) {
                //判断消息是不是自己发送的
                var msg = sockInit.showImg(obj.content);
                var isMe = (obj.userId === sockInit.userId);
                var contentDiv = '<div>' + msg + '</div>';
                var userNameDiv = '<span>' + obj.userName + ' · ' + moment().format('YYYY/MM/DD hh:mm:ss') + '</span>';
                var picDiv = '<i style="background:url(' + obj.picUrl + ') no-repeat center center;background-size:cover"></i>';
                var section = d.createElement('section');
                if (isMe) {
                    section.className = 'user ' + obj.sex;
                } else {
                    section.className = 'service ' + obj.sex;
                }
                section.innerHTML = userNameDiv + contentDiv + picDiv;

                sockInit.msgObj.appendChild(section);
                // 保持滚动div在最底部
                sockInit.msgObj.scrollTop = sockInit.msgObj.scrollHeight;
            });


        },
        /**
         * 表情点击事件
         */
        expresClick: function (format,path) {
            var span = $('.expreTip span');
            $.each(span, function (i, o) {
                var _i = i;
                if(path != '4800' && i<10){
                    _i = '0' + i;
                }
                $(this).click(function () {
                    $('.expreTip').hide();
                    $('#content').val($('#content').val() + ' [img_gif:' + '/' + path + '/' +_i + '.' + format + ']');
                })
            })
        },
        /**
         * 处理表情显示
         */
        showImg: function (msg) { 
            var match, result = msg,
            reg = /\[img_gif:\/\d+\/\d+.\w+\]/g,
            emojiIndex,
            totalEmojiNum =  $('.expreTip span').length;
            while (match = reg.exec(msg)) {
                emojiIndex = match[0].slice(9, -1);
                if (emojiIndex > totalEmojiNum) {
                    result = result.replace(match[0], '[X]');
                } else {
                    result = result.replace(match[0], '<img src="./img_gif/' + emojiIndex +'" />');
                };
            };
            return result;
        },
    }
    d.getElementById('content').onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
            sockInit.submit();
            $(this).val('');
            $(this).focus();
            return false;
        }
    }

    /**
     * 发送表情
     */



})();