let goods_div = $("#goods");

let goods = [];

let total_money = 0;

let add_good_to_trolley = (item) => {
  let item_div = `<div class="card col-5">
  <div class="card-body">
      <div class="row">
          <div class="col-8">
              <h2 class="card-title">${item.name}</h2>
          </div>

          <div class="col-4">
              <h5 class="price">￥${item.price}</h5>
          </div>
      </div>

      <div class="row">
          <div class="col-7">
              <button type="button" class="btn btn-light minus"> - </button>
              <span class="num"> 1 </span>
              <button type="button" class="btn btn-light add"> + </button>
          </div>

          <div class="col-5">
              <button type="button" class="btn btn-danger delete"> 删除 </button>
          </div>
      </div>
  </div>
</div>`;
  goods_div.append($(item_div));
  total_money += parseFloat(item.price);
  $("#total_money").text(`￥ ${total_money}`);
};

for (item of goods) {
  add_good_to_trolley(item);
}

$(".good-area").on("click", ".delete", (e) => {
  let index = $(".delete").index(e.target);
  let item = goods[index];

  total_money -= parseFloat(item.price);
  goods.splice(index, 1);

  $(".card").eq(index).remove();
  $("#total_money").text(`￥ ${total_money}`);
});

$(".good-area").on("click", ".minus", (e) => {
  let index = $(".minus").index(e.target);
  let item = goods[index];

  if (item.num > 1) {
    item.num -= 1;
    total_money -= parseFloat(item.price);

    $(".num").eq(index).text(item.num);

    $("#total_money").text(`￥ ${total_money}`);
  } else {
    total_money -= parseFloat(item.price);
    goods.splice(index, 1);

    $(".card").eq(index).remove();
    $("#total_money").text(`￥ ${total_money}`);
  }
});

$(".good-area").on("click", ".add", (e) => {
  let index = $(".add").index(e.target);
  let item = goods[index];

  item.num += 1;
  $(".num").eq(index).text(item.num);
  total_money += parseFloat(item.price);

  $("#total_money").text(`￥ ${total_money}`);
});

$("#empty_trolley").click(() => {
  goods = [];
  $(".card").remove();
  total_money = 0;
  $("#total_money").text(`￥ ${total_money}`);
});

var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices
  .getUserMedia({
    video: {
      facingMode: "environment",
    },
  })
  .then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
  });

function debounce(fn, wait) {
  var timer = null;
  return function () {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, wait);
  };
}

function drawLine(begin, end, color) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;
    canvasElement.hidden = false;

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    var imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      // 标记出二维码
      drawLine(
        code.location.topLeftCorner,
        code.location.topRightCorner,
        "#FF3B58"
      );
      drawLine(
        code.location.topRightCorner,
        code.location.bottomRightCorner,
        "#FF3B58"
      );
      drawLine(
        code.location.bottomRightCorner,
        code.location.bottomLeftCorner,
        "#FF3B58"
      );
      drawLine(
        code.location.bottomLeftCorner,
        code.location.topLeftCorner,
        "#FF3B58"
      );

      console.log(code.data);

      // 添加商品
      let item_info = code.data.split("_"); // 小麦面粉_20
      if (item_info.length == 2) {
        let item = {
          name: item_info[0],
          price: item_info[1],
          num: 1,
        };

        if (goods.length == 0) {
          goods.push(item);
          add_good_to_trolley(item);
        } else {
          let flag = false;
          for (const good of goods) {
            console.log(good.name, item.name);
            if (good.name == item.name) flag = true;
          }
          if (!flag) {
            goods.push(item);
            add_good_to_trolley(item);
          }
        }
      }
    }
  }
  requestAnimationFrame(tick);
}

// 全屏
function requestFullScreen(element) {
  var requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

$("#fullscreen").click(() => {
  requestFullScreen(document.documentElement);
});
