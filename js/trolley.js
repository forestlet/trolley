let goods_div = $("#goods");

let goods = [];

let total_money = 0;

let add_good_to_trolley = (item) => {
  let item_div = `<div class="card col-5">
                <div class= "card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <div class="row">
                        <p class="col-6 price">￥ ${item.price}</p>
                        <div class="col-6">
                            <button type="button" class="btn btn-danger delete"> 删除 </button>
                        </div>
                    </div>
                </div >
            </div >`;
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

let scanned_item = false;

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

      if (!scanned_item) {
        console.log(code.data);

        // 添加商品
        let item_info = code.data.split("_"); // 小麦面粉_20
        if (item_info.length == 2) {
          let item = {
            name: item_info[0],
            price: item_info[1],
          };

          if (confirm(`添加商品 ${item.name} 吗？`)) {
            goods.push(item);
            add_good_to_trolley(item);
            scanned_item = true;
          }
        }
      }
    } else {
      scanned_item = false;
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
