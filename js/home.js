const $ = mdui.$;

function getParam(reqParam) {
    reqParam = reqParam.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const paraReg = new RegExp('[\\?&]' + reqParam + '=([^&#]*)');
    const results = paraReg.exec(window.location.href);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 改变顶部导航栏的颜色
const getScrollPosition = (el = window) => ({
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
});

function changeNavColor() {
    if (getScrollPosition().y >= window.innerHeight * 0.3) {
        $("body").addClass("mdui-theme-primary-teal");
    } else {
        $("body").removeClass("mdui-theme-primary-teal");
    }
}
window.onscroll = changeNavColor;

// 获取近期文章
document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        $.ajax({
            method: 'GET',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fblog.whitegx.top%2Ffeed',
            timeout: 8000,
            success: function (res) {
                var parsed = typeof res === 'string' ? JSON.parse(res) : res;
                var items = parsed && parsed.items ? parsed.items : [];
                var container = document.getElementById("posts-label");
                if (container && items.length > 0) {
                    var count = Math.min(5, items.length);
                    for (var i = 0; i < count; i++) {
                        var element = document.createElement('a');
                        element.href = items[i].link;
                        element.className = "mdui-list-item mdui-ripple";
                        element.textContent = items[i].title;
                        element.target = "_blank";
                        element.rel = "noopener noreferrer";
                        container.appendChild(element);
                    }
                } else if (container) {
                    container.innerHTML = '<div class="mdui-list-item">暂无近期文章</div>';
                }
                $("#post-spinner").remove();
            },
            error: function () {
                var container = document.getElementById("posts-label");
                if (container) {
                    container.innerHTML = '<div class="mdui-list-item mdui-text-color-secondary">近期文章加载超时，可直接前往博客查看</div>';
                }
                $("#post-spinner").remove();
            }
        });
    }
};

// 赞赏栏（仅在页面存在对应元素时初始化）
var supportTabEl = document.getElementById('support-tab');
var supportEl = document.getElementById('support');
if (supportTabEl && supportEl) {
    var tab = new mdui.Tab('#support-tab');
    var support = new mdui.Dialog('#support');
    supportEl.addEventListener('open.mdui.dialog', function () {
        tab.handleUpdate();
    });
}

function qqpay() {
    window.open("https://cdn.jsdelivr.net/gh/mcxiaolan/jsdelivr@master/qqpay.png");
}

function wechatpay() {
    window.open("https://cdn.jsdelivr.net/gh/mcxiaolan/jsdelivr@master/wechatpay.png");
}

if (document.referrer) {
    console.log(document.referrer);
    console.log(
        '%c请注意！我们不会收集并发送上述的来源网址信息！',
        'color: red'
    );
}

// 获取原始的页面标题
var normal_title = document.title;
// 监听页面的可见性
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
        document.title = 'Oops! 页面崩溃了！';
    } else {
        document.title = "好耶！页面修好了！";
        setTimeout(function () {
            document.title = normal_title;
        }, 1000);
    }
});
