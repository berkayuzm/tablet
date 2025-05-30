function getVehicleSpeed() {
    var vehicleSpeed = 0;

    globalvehicleSpeedTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/motor_controller/velocity',
        messageType: 'std_msgs/Float32'
    });
    
    globalvehicleSpeedTopic.subscribe(function (message) {
        vehicleSpeed = message.data;
        $("#speed-state").html(vehicleSpeed.toFixed(1) + "<span> m/sn</span>");
    });
}

function ShowBatteryState() {
    var battery_topic_state = new ROSLIB.Topic({
        ros: ros,
        name: '/state/battery_level',
        messageType: 'std_msgs/Int32'
    });
    battery_topic_state.subscribe(function (batterydata) {
        var batterystate = batterydata.data.toString();
        $("#battery-state").html("%" + batterystate.toString());
        $("#parameter_battery").html("%" + batterystate);
        if (batterystate > 90) {
            $("#battery-charge").css("width", "89%")
            $("#parameter_battery").html(batterystate);
        }
        else if (batterystate < 10) {
            $("#battery-charge").css("width", "" + 10 + "%");
            $("#battery-charge").css("color", "red");
        }
        else {
            $("#battery-charge").css("width", "" + batterystate + "%");
        }
    });
}

var yaw;

function ShowPositionMarker() {
    var map_pixel_x = 712;
    var map_pixel_y = 762;

    var positiontopic = new ROSLIB.Topic({
        ros: ros,
        name: '/sk_comm_manager_node/robot_position_as_pixels',
        messageType: 'geometry_msgs/PoseStamped'
    });

    positiontopic.subscribe(function (positiondata) {
        yaw = positiondata.pose.orientation.w;
        var marker = $("#divMark");
        $("#parameter_yaw").html(yaw.toFixed(1) + "°");
        marker.css("top", (map_pixel_y - 10) - positiondata.pose.position.y + 'px');
        marker.css("left", -10 + positiondata.pose.position.x + "px");
        marker.css("transform", 'rotate(' + -1 * yaw + 'deg)');
    });
}

function CheckWarnings() {
    var symphonyMessagesTopic = new ROSLIB.Topic({
        ros: ros,
        name: "/state/current",
        messageType: "sk_comm_msgs/State",
      });
    symphonyMessagesTopic.subscribe(function (message) {
        if (message.state_localization == 1010) {
            $(".symphony-message").css("display", "none");
            $("#vehicle-could-not-location").css("display", "none");
        }
        else {
            $(".symphony-message").css("display", "flex");
            $("#vehicle-could-not-location").css("display", "block");
        }

        if (message.state_safety == 240) {
            $(".symphony-message").css("display", "flex");
            $("#check_lasers").css("display", "flex");
        }
        else {
            $(".symphony-message").css("display", "none");
            $("#check_lasers").css("display", "none");
        }
    });
}

function ShowTFDatas() {
    var tfClient = new ROSLIB.TFClient({
        ros: ros,
        angularThres: 0.01,
        transThres: 0.01,
        rate: 20.0,
        fixedFrame: 'world'
    });
    tfClient.subscribe('base_link', function (tf) {
        console.log(tf);
        $("#translation_x").html("Translation X is " + tf.translation.x.toFixed(2))
        $("#translation_y").html("Translation Y is " + tf.translation.y.toFixed(2))
        $("#translation_z").html("Translation Z is " + tf.translation.z.toFixed(2))
        $("#orientation_x").html("Orientation X is " + tf.rotation.x.toFixed(2))
        $("#orientation_y").html("Orientation y is " + tf.rotation.y.toFixed(2))
        $("#orientation_z").html("Orientation Z is " + tf.rotation.z.toFixed(2))
        $("#orientation_w").html("Orientation W is " + tf.rotation.w.toFixed(2))

    });
}