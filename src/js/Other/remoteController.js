$("#popupclose").click(function () {
  $("#popup").css("display", "none");
});
function init() {
  var elementLeft=$("#remote-controller-image-left");
  var elementRight=$("#remote-controller-image-right");
  onLongPress(elementLeft);
  onLongPress(elementRight);
  console.log("remote controller initialized");
}
init();
function onLongPress(node) {
  node.ontouchstart = nullEvent;
  node.ontouchend = nullEvent;
  node.ontouchcancel = nullEvent;
  node.ontouchmove = nullEvent;
}
function nullEvent(event) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}
var _timeoutId = 0;

var _startHoldEvent = function(e) {
  _timeoutId = setInterval(function() {
     myFunction.call(e.target);
  }, 1000);
};

var _stopHoldEvent = function() {
  clearInterval(_timeoutId );
};
function remoteControllerConnection(ros) {
  var teleop_vel_topic = new ROSLIB.Topic({
    ros: ros,
    name: "/teleop_vel",
    messageType: "geometry_msgs/Twist",
  });
  $("#up_button_arrow").click(function () {
    console.log("flksdajşflkjşd")
    var teleopvelforward_msg = new ROSLIB.Message({
      linear: {
        x: 200,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    teleop_vel_topic.publish(teleopvelforward_msg);
  });
  $("#down_button_arrow").click(function () {
    var teleopvelbackward_msg = new ROSLIB.Message({
      linear: {
        x: -200,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });

    teleop_vel_topic.publish(teleopvelbackward_msg);
  });
  $("#right_button_arrow").on("touchstart mousedown",function () {
    var teleopvelright_msg = new ROSLIB.Message({
      linear: {
        x: 0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: -100,
      },
    });
    _timeoutId = setInterval(function() {
    teleop_vel_topic.publish(teleopvelright_msg);
    console.log("right")
   }, 100 );
   

  }).on("touchend touchcancel mouseup",_stopHoldEvent);

  $("#left_button_arrow").on("touchstart mousedown",function () {
    var teleopvelleft_msg = new ROSLIB.Message({
      linear: {
        x: 0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 100,
      },
    });
    _timeoutId = setInterval(function() {
     teleop_vel_topic.publish(teleopvelleft_msg);
      console.log("left")
     }, 100 );
  }).on("touchend touchcancel mouseup",_stopHoldEvent);

  $("#center_button").click(function(){
    console.log("center button clicked");
    var teleopvelleft_msg = new ROSLIB.Message({
      linear: {
        x: 0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    teleop_vel_topic.publish(teleopvelleft_msg);
  })

  var cmdPublisher = new ROSLIB.Topic({
    ros: ros,
    name: "/dio/cmd",
    messageType: "std_msgs/String",
  });

  document.getElementById("resetButton").addEventListener("click", function () {
    var message = new ROSLIB.Message({
      data: "RESET",
    });
    cmdPublisher.publish(message);
    console.log("Reset mesajı gönderildi.");
  });
}
