$("#popupclose").click(function () {
  $("#popup").css("display", "none");
});

function remoteControllerConnection(ros) {
  var teleop_vel_topic = new ROSLIB.Topic({
    ros: ros,
    name: "/teleop_vel",
    messageType: "geometry_msgs/Twist",
  });
  $("#up_button_arrow").click(function () {
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
  $("#right_button_arrow").click(function () {
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

    teleop_vel_topic.publish(teleopvelright_msg);
  });
  $("#left_button_arrow").click(function () {
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
    teleop_vel_topic.publish(teleopvelleft_msg);
  });

  $("#center_button").click(function(){
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
