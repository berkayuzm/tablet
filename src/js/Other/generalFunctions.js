function pauseResume() {
    if ((state.state_mission_manager == 810) || (state.state_mission_manager == 830)) {

        var cmdPause = new ROSLIB.Service({
            ros: ros,
            name: '/mission_node/disable'
        });

        var request = new ROSLIB.ServiceRequest();

        cmdPause.callService(request, function (result) {
        });
    } else if (state.state_mission_manager == 820) {

        var cmdPause = new ROSLIB.Service({
            ros: ros,
            name: '/mission_node/enable'
        });

        var request = new ROSLIB.ServiceRequest();

        cmdPause.callService(request, function (result) {
        });
    }
}

function startSymphony() {
    console.log("deneme")
    //$(".modal-container, .modal-start-symphony").show();
    $("#open-symphony-are-you-sure-container").show();   
    $("#start-symphony-yes-button").on("click", function () {
        console.log("açma sinyali gitti")
        if (ros.isConnected) {
            var cmdPause = new ROSLIB.Service({
                ros: ros,
                name: '/sk_comm_manager_node/start_symphony'
            });
            var request = new ROSLIB.ServiceRequest();
            cmdPause.callService(request, function (result) {
                $("#start_button").show();
                $("#stop_symphony").css("display","flex")
                $("#start_symphony").hide();
            });
        }
    });
    $("#start-symphony-no-button").on("click", function () {
        $("#open-symphony-are-you-sure-container").hide(); 
    });
}

function stopSymphony() {
    $("#stop-symphony-are-you-sure-container").show(); 
    $("#stop-symphony-yes-button").on("click", function () {
        console.log("kapatma sinyali gitti")
        if (ros.isConnected) {

            var cmdPause = new ROSLIB.Service({
                ros: ros,
                name: '/sk_comm_manager_node/stop_symphony'
            });
    
            var request = new ROSLIB.ServiceRequest();
            cmdPause.callService(request, function (result) {
                $("#start_button .text span").html("Görev Modunu Aç");
                $(".sidebar .vehicle-action-buttons .vehicle-action-button.open-mission-mode-button").css("border-color", "#17e217");
                $(".sidebar .vehicle-action-buttons .vehicle-action-button.open-mission-mode-button").css("color", "#17e217");
    
                cancel_mission.hide();
                $("#stop_symphony").hide();
                $("#start_symphony").show();
            });
        }
    });
    $("#stop-symphony-no-button").on("click", function () {
        $("#stop-symphony-are-you-sure-container").hide(); 
    });
    
}

function shutdownSystem() {
    $("#open-close-are-you-sure-title").html("Symphony Sistemi Kapatmak istiyor musunuz?")
    $("#shutdown_yes").on("click", function () {
        if (ros.isConnected) {

            $("#shutdown_yes").html(`
            <div role="status">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-white-600 h-[20px] w-[15px] fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
            `);

            var cmdPause = new ROSLIB.Service({
                ros: ros,
                name: '/sk_comm_manager_node/shutdown_system'
            });

            var request = new ROSLIB.ServiceRequest();
            cmdPause.callService(request, function (result) {
                // $(".modal-shutdown").css("display", "none");
                // $(".modal-container").css("display", "none");
                window.location.reload(false);
            });
        }
    });
    $("#shutdown_no").on("click", function () {
        // $(".modal-shutdown").css("display", "none");
        // $(".modal-container").css("display", "none");
    });
}

function killMission() {
    console.log(ros)
    var cmdPause = new ROSLIB.Service({
        ros: ros,
        name: '/mission_node/kill_mission'
    });

    var request = new ROSLIB.ServiceRequest();

    cmdPause.callService(request, function (result) {
        console.log("Görev Silindi!");
    });
}

function freezeMission() {
    var cmdPause = new ROSLIB.Service({
        ros: ros,
        name: '/mission_node/disable'
    });
    var request = new ROSLIB.ServiceRequest();

    cmdPause.callService(request, function (result) {
        $("#mission_state_label").html("Kapalı /" + missionsCnt);
    });
}

function continueMission() {
    var cmdContinue = new ROSLIB.Service({
        ros: ros,
        name: '/mission_node/enable'
    });

    var request = new ROSLIB.ServiceRequest();

    cmdContinue.callService(request, function (result) {
        $("#mission_state_label").html("Açık/" + missionsCnt);
    });
}


function sendMissionRaw(mission_cmd) {
    var missionPub = new ROSLIB.Topic({
        ros: ros,
        name: '/mission/mission_cmd',
        messageType: 'sk_comm_msgs/MissionCmd'
    });
    missionPub.publish(mission_cmd);
}

function createMission(mission_id, mission_type, zone_src_name, zone_dest_name) {
    var mission_cmd = new ROSLIB.Message({
        header: {
            seq: 0,
            stamp: {
                secs: 0,
                nsecs: 0
            },
            frame_id: 'zones_origin'
        },
        mission_id: mission_id,
        mission_cmd: mission_type,
        zone_name_src: zone_src_name,
        zone_name_dest: zone_dest_name,
        station_name_src: '',
        station_name_dest: '',
        src: {
            position: { x: 0.0, y: 0.0, z: 0.0 },
            orientation: { x: 0.0, y: 0.0, z: 0.0, w: 0.0 }
        },
        dest: {
            position: { x: 0.0, y: 0.0, z: 0.0 },
            orientation: { x: 0.0, y: 0.0, z: 0.0, w: 0.0 }
        },
        item_to_carry: {
            qr_tag_id: '', barcode_id: '', rf_tag_id: '', width: 0, height: 0, depth: 0
        },
        src_cell: {
            cell_id: 0,
            qr_tag_id: '',
            barcode_id: '',
            rf_tag_id: '',
            location: {
                position: { x: 0.0, y: 0.0, z: 0.0 },
                orientation: { x: 0.0, y: 0.0, z: 0.0, w: 0.0 },
            },
        },
        dest_cell: {
            cell_id: 0,
            qr_tag_id: '',
            barcode_id: '',
            rf_tag_id: '',
            location: {
                position: { x: 0.0, y: 0.0, z: 0.0 },
                orientation: { x: 0.0, y: 0.0, z: 0.0, w: 0.0 },
            },
        },
        src_joints: {
            header: {
                seq: 0,
                stamp: { secs: 0, nsecs: 0 },
                frame_id: '',
            },
            name: [''],
            position: [0],
            velocity: [0],
            effort: [0],
        },
        dest_joints: {
            header: {
                seq: 0,
                stamp: { secs: 0, nsecs: 0 },
                frame_id: '',
            },
            name: [''],
            position: [0],
            velocity: [0],
            effort: [0],
        },
        waypoints_src: {
            poses: [
                {
                    header: {
                        seq: 0,
                        stamp: { secs: 0, nsecs: 0 },
                        frame_id: '',
                    },
                    pose: {
                        position: { x: 0.0, y: 0.0, z: 0.0 },
                        orientation: { x: 0.0, y: 0.0, z: 0.0, w: 0.0 },
                    },
                }
            ]
        },
        waypoints_dest: {
            poses: [
                {
                    header: {
                        seq: 0,
                        stamp: { secs: 0, nsecs: 0 },
                        frame_id: '',
                    },
                    pose: {
                        position: { x: 0.0, y: 0.0, z: 0.0 },
                        orientation: { x: 0.0, y: 0.0, z: 0.0, w: 0.0 },
                    },
                }
            ]
        },
        pick_product_shift_x: 0.0,
        pick_product_shift_y: 0.0,
        pick_product_shift_z: 0.0,
        drop_product_shift_x: 0.0,
        drop_product_shift_y: 0.0,
        drop_product_shift_z: 0.0,
    });

    return mission_cmd;
}

   // Define the /initialpose publisher
   console.log("myros=>"+this.ros)
   
var gpsPoseSubscriber = new ROSLIB.Topic({
    ros: ros,
    name: '/gps_pose',
    messageType: 'geometry_msgs/PoseStamped'
  });
// Define the message
const initialPoseMessage = new ROSLIB.Message({
    header: {
        seq: 0,
        stamp: {
            secs: 0,
            nsecs: 0
        },
        frame_id: 'map' // Set the frame ID, e.g., 'map'
    },
    pose: {
        pose: {
            position: { x: 138.96, y: -80.57, z: 0.0 },
            orientation: { x: 0.0, y: 0.0, z: -0.67, w: 0.73 }
        },
        covariance: [
            0.002, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.002, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.002
        ]
    }
});

// Publish the message
function publishInitialPose() {
    var initialPose = new ROSLIB.Message({
        header: {
          stamp:"" ,
          frame_id: "charge_point"
        },
         pose: {
        pose: {
            position: { x: 138.96, y: -80.57, z: 0.0 },
            orientation: { x: 0.0, y: 0.0, z: -0.67, w: 0.73 }
        },
          // Covariance matrix (6x6 flattened array)
          covariance: [
            0.1, 0,   0,   0,   0,   0,
            0,   0.1, 0,   0,   0,   0,
            0,   0,   0.1, 0,   0,   0,
            0,   0,   0,   0.1, 0,   0,
            0,   0,   0,   0,   0.1, 0,
            0,   0,   0,   0,   0,   0.1
          ]
        }
      });
    
    initialPosePublisher.publish(initialPose);
    console.log('Published /initialpose message:', initialPoseMessage);
}




function findLocationWithGPS(){
    console.log(ros)
    gpsPoseSubscriber.subscribe(function(gpsPose) {
        console.log('Received GPS pose:', gpsPose);
      
        // Create a PoseWithCovarianceStamped message
        var initialPose = new ROSLIB.Message({
          header: {
            stamp: gpsPose.header.stamp,
            frame_id: gpsPose.header.frame_id
          },
          pose: {
            pose: {
              position: {
                x: gpsPose.pose.position.x,
                y: gpsPose.pose.position.y,
                z: gpsPose.pose.position.z
              },
              orientation: {
                x: gpsPose.pose.orientation.x,
                y: gpsPose.pose.orientation.y,
                z: gpsPose.pose.orientation.z,
                w: gpsPose.pose.orientation.w
              }
            },
            // Covariance matrix (6x6 flattened array)
            covariance: [
              0.1, 0,   0,   0,   0,   0,
              0,   0.1, 0,   0,   0,   0,
              0,   0,   0.1, 0,   0,   0,
              0,   0,   0,   0.1, 0,   0,
              0,   0,   0,   0,   0.1, 0,
              0,   0,   0,   0,   0,   0.1
            ]
          }
        });
      
        // Publish the initial pose
        initialPosePublisher.publish(initialPose);
        console.log('Published initial pose based on GPS data.');
      });
}

