var vehicle_circle = $(".sidebar .vehicle-information p");
var cancel_mission = $(".vehicle-action-button.cancel-mission-button");
var mission_state_label = $("#mission_state_label");
missionsCnt=0;//Global değişken tanımlaması(değişken window objesine bağlanıyor)
function rosConnect() {
    console.log("Connecting ROS with ", rosurl);
    ros = new ROSLIB.Ros({
        url: rosurl,
        reconnect_on_close: true
    });
}

$(document).ready(function () {
    console.log("Document ready A...");

    rosConnect();
    console.log("rosgeldi=>", ros);
    if (localStorage.getItem('boyut') == 'false') {
        init();
        $("#open_rviz").removeClass('active');
        $(".map img").show();
        $(".map #map_3d").hide();
    }
    else {
        init();
        initRviz(ros);
        $("#open_rviz").addClass('active');
        $(".map img").hide();
        $(".map #map_3d").show();
    }
});

setTimeout(function () {
    init();
}, 3000);

var topicState = null;
var topicMissions = null;
var login = false;

 function init() {
    //Sistem bağlantısı Kapaliyken otonom Kapali yazısı çıkıp, arkaplan kırmızıya dönüyor,
    //Acik iken yeşile dönüyor.
    if (ros.isConnected == false) {
        //rosConnect();
        topicState = null;
        topicMissions = null;
        login = false;

        $("#device_label").html("Kapalı");
        mission_state_label.html("Kapalı / 0");
        $("#stop_symphony").hide();
        $("#start_symphony").show();
        vehicle_circle.css("background-color", "#B30900");
    }
    else {
        $("#device_label").html("Beklemede");
        $(".autonomous-status").css("background-color", "#c7c700");
        $(".sidebar .vehicle-information p").css("background-color","#8A0700")
        $(".connection-waiting-container").css("display", "none");
        vehicle_circle.css("background-color", "#279C27");
        if (login == false) {
        if (topicMissions == null) {
            var topicMissions = new ROSLIB.Topic({
                ros: ros,
                name: '/mission/state',
                messageType: 'sk_comm_msgs/MissionState'
            });
            topicMissions.subscribe(function (message) {
                missionsLength = message.mission_state.length;
                missionsCnt = 0;
                element = 0;
                if (missionsLength > 0) {
                    for (let index = 0; index < message.mission_state.length; index++) {
                        element = message.mission_state[index];
                        if ((element == 1) || (element == 2) || (element == 3)) {
                            missionsCnt = missionsCnt + 1;
                        }
                    }
                }
                if (missionsCnt > 0) {
                    cancel_mission.show();
                }
                else {
                    cancel_mission.hide();
                }
            });
        }

            var symphonyMessagesTopic = new ROSLIB.Topic({
                ros: ros,
                name: '/state/current',
                messageType: 'sk_comm_msgs/State'
            });

            CheckWarnings();
            ShowBatteryState();
            ShowPositionMarker();

            if (topicState == null) {
                var topicState = new ROSLIB.Topic({
                    ros: ros,
                    name: '/state/current',
                    messageType: 'sk_comm_msgs/State'
                });
                topicState.subscribe(function (message) {
                    state = message;
                    $("#device_label").html("Açık");
                    $("#stop_symphony").css("display","flex")
        $(".sidebar .vehicle-information p").css("background-color","rgb(25, 209, 25)")

                    $("#start_symphony").hide();
                    $(".connection-waiting").css("display", "none");
                     $(".connection-waiting-container").css("display", "none");
                    $(".autonomous-status").css("background-color", "#1E5128");
                    if (state.state_mission_manager == 810|| state.state_mission_manager == 830) {
                        mission_state_label.html("Açık/" + missionsCnt);
                        $("#start_button").css("display", "none");
                        $("#stop_button").css("display", "flex");
                        $("#mission-state-container").css("background-color", "#1E5128")

                    }
                    if (state.state_mission_manager == 820 ) {
                        $("#start_button").css("display", "flex");
                        $("#stop_button").css("display", "none");
                        $("#mission_state_label").html(
                            "Kapalı / " + missionsCnt
                          );
                          $("#mission-state-container").css("background-color", "#8A0700")
                    }

                    if (state.state_safety == 210) {
                        $("#safety_label").html("Güvenli");
                        $(".security-status").css("background-color","#1E5128")

                    }
                    else if (state.state_safety == 220 || state.state_mission_manager == 230) {
                        $("#safety_label").css("color", "#c7c700");
                        if (state.state_safety == 220) {
                            $("#safety_label").html("Kısmi Güvenli");
                        }
                        else {
                            $("#safety_label").html("Minimum");
                        }
                    }
                    else {
                        $("#safety_label").html("Tehlikeli");
                        $(".security-status").css("background-color","#8A0700")
                    }
                });

                getVehicleSpeed();
                // ShowTFDatas();
                remoteControllerConnection(ros);

                var mf7_coordinates_topic = new ROSLIB.Topic({
                    ros: ros,
                    name: '/tracked_pose',
                    messageType: 'geometry_msgs/PoseStamped',
                    throttle_rate: 1000,
                    queue_size: 1,
                });

                mf7_coordinates_topic.subscribe(function (message) {
                    var mf7_pose_x = message.pose.position.x;
                    var mf7_pose_y = message.pose.position.y;
                    var mf7_pose_z = message.pose.position.z;

                    var mf7_orientation_x = message.pose.orientation.x;
                    var mf7_orientation_y = message.pose.orientation.y;
                    var mf7_orientation_z = message.pose.orientation.z;
                    var mf7_orientation_w = message.pose.orientation.w;

                    var heading = getRPY(mf7_orientation_x, mf7_orientation_y, mf7_orientation_z, mf7_orientation_w);
                });

                function getRPY(x, y, z, w) {
                    var t0 = 2.0 * (w * x + y * z);
                    var t1 = +1.0 - 2.0 * (x * x + y * y);
                    var roll_x = Math.atan2(t0, t1);

                    var t2 = +2.0 * (w * y - z * x);
                    if (t2 > +1.0) {
                        t2 = +1.0;
                    }

                    else {
                        t2;
                    }

                    if (t2 < -1.0) {
                        t2 = -1.0;
                    }
                    else {
                        t2;
                    }

                    var pitch_y = Math.asin(t2);

                    var t3 = +2.0 * (w * z + x * y);
                    var t4 = +1.0 - 2.0 * (y * y + z * z);
                    var yaw_z = Math.atan2(t3, t4)

                    return yaw_z;
                }
            }


        
        }
        login = true;
    }
}

$(document).ready(function () {
    console.log("Document ready B...");
    setTimeout(function () {
        checkConnections()
    }, 3000);
});

  function checkConnections() {
    console.log("deneme")
    setInterval(function () {
        console.log("Checking connection...");
        if (ros.isConnected == false) {
            var testws = new WebSocket(rosurl);
            $("#device_label").html("Kapalı");
            $("#start_button .text span").html("Görev Modunu Aç");
            $(".connection-title").css("display", "none");
            $(".connection-waiting-mini").css("display", "none");
            $(".cant-connection-title").css("display", "block");
            $(".cant-connection-waiting-mini").css("display", "block");
            $("#connection-waiting-loading-gif").html(
                `
                 <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
                `
                )
            $(".sidebar .vehicle-action-buttons .vehicle-action-button.open-mission-mode-button").css("border-color", "#17e217");
            $(".sidebar .vehicle-action-buttons .vehicle-action-button.open-mission-mode-button").css("color", "#17e217");
            testws.onopen = function () {
                window.location.reload();
            };
        }
    }, 3000);
}

    