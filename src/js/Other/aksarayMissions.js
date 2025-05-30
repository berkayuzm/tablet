// var activeMissions = [];
// if(localStorage.getItem("activeMissionCount")>0){
//     var activeMissionCount=localStorage.getItem("activeMissionCount")
// }
// else{
//     var activeMissionCount=0;

// }
// function giveMission(missionId) {
//   missions.map((mission) => {
//     if (mission.missionId === missionId) {
//       activeMissions.push(mission);
      
//     }
//   });
//   if (localStorage.getItem("activeMissions") ==undefined) {
//     console.log("boş")
//     localStorage.setItem("activeMissions", JSON.stringify(activeMissions));
//     activeMissions.map((element)=>{
//         activeMissionCount++;
//         var newDiv = $("<div>");
//         newDiv.addClass("active-mission-element");
//         var innerDiv = $("<div>");
//         innerDiv.addClass("alert alert-light");
//         innerDiv.attr("role", "alert");
//         innerDiv.text(element.missionDescription);
//         newDiv.append(innerDiv);
//         $(".active-mission-container").append(newDiv);
//     })
//     activeMissions = [];
//   } else {
//     console.log("dolu")
//     $(".active-mission-container").empty()
//     var newActiveMissions = JSON.parse(localStorage.getItem("activeMissions"));
//     console.log(newActiveMissions)
//     activeMissions.forEach((element) => {
//       newActiveMissions.push(element);
//       activeMissionCount++;
      
//     });

//     newActiveMissions.forEach((element)=>{
//         var newDiv = $("<div>");
//       newDiv.addClass("active-mission-element");
//       var innerDiv = $("<div>");
//       innerDiv.addClass("alert alert-light");
//       innerDiv.attr("role", "alert");
//       innerDiv.text(element.missionDescription);
//       newDiv.append(innerDiv);
//       $(".active-mission-container").append(newDiv);
//     })
//     localStorage.setItem("activeMissions", JSON.stringify(newActiveMissions));
//     activeMissions = [];
//   }
//   $(".active-mission-element").children().first().removeClass("alert-light").addClass("alert-warning")
//   console.log(activeMissionCount)
//   localStorage.setItem("activeMissionCount",activeMissionCount)
// }
//Boş arabalar hazır
function readyEmptyCars() {
    var ready_empty_cars = new ROSLIB.Topic({
      ros: ros,
      name: "/mission/item_count_waiting",
      messageType: "std_msgs/Int32",
    });
    var integerData = new ROSLIB.Message({
      data: 1,
    });
  
    ready_empty_cars.publish(integerData);
    console.log("click");
  }
  // function takeEmptyCarsInside() {
  //   var request_mission_cmd_drop = createMission(6, "MOVE_TO_ZONE", "", "zone_3");
  //   sendMissionRaw(request_mission_cmd_drop);
  // }
  //BOŞ ARABALARI AL
  function takeEmptyCars() {
    var request_mission_cmd_drop = createMission(1, "PICK", "zone_2", "");
    sendMissionRaw(request_mission_cmd_drop);
  }
  //Yükleri alma noktasına git
  function moveToZone1() {
    var request_mission_cmd_drop = createMission(2, "MOVE_TO_ZONE", "", "zone_1");
    sendMissionRaw(request_mission_cmd_drop);
  }
  
  //YÜKLERİ GÖNDER 1
  function sendDropMission() {
    var request_mission_cmd_drop = createMission(3, "DROP", "", "zone_drop");
    sendMissionRaw(request_mission_cmd_drop);
  }
  //Yükleri gönder 2 
  function sendDropMission2() {
    var request_mission_cmd_drop = createMission(4, "DROP", "", "zone_drop_2");
    sendMissionRaw(request_mission_cmd_drop);
  }
  //Yükleri gönder 3
  function sendDropMission3() {
    var request_mission_cmd_drop = createMission(7, "DROP", "", "zone_drop_3");
    sendMissionRaw(request_mission_cmd_drop);
  }
  
  //Parka Dön
  function backToPark() {
    var request_mission_cmd_drop = createMission(
      5,
      "MOVE",
      "",
      "charge"
    );
    sendMissionRaw(request_mission_cmd_drop);
  }
  
  //Yükleri bırak
  function unlockPim() {
    var message_1 = new ROSLIB.Message({
      data: 1,
    });
    var message_0 = new ROSLIB.Message({
      data: 0,
    });
    var pim_up_topic = new ROSLIB.Topic({
      ros: ros,
      name: "/io_3/outputs/lever_trigger",
      messageType: "std_msgs/Int32",
    });
    pim_up_topic.publish(message_1);
    setTimeout(function () {
      pim_up_topic.publish(message_0);
    }, 2000);
  }
  
    