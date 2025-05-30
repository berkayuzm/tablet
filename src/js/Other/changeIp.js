var state = null, ros = null, globeNavigator = null, dynamicIp, rosUrl;

$(document).ready(function () {
    $("#save_ip").click(function () {
        localStorage.setItem("ipAdress", $("#dynamic_ip").val());
        rosUrl = "ws://" + localStorage.getItem("ipAdress") + ":9090";
        window.location.reload(false);
    });
    $("#dynamic_ip").val(localStorage.getItem("ipAdress"));
});
if (localStorage.getItem("ipAdress") == null || localStorage.getItem("ipAdress") == "") {
    rosurl = "ws://192.168.10.100:9090";
}
else {
    rosurl = "ws://" + localStorage.getItem("ipAdress") + ":9090";
}

$("#show_ip").html("IP: "+localStorage.getItem("ipAdress"));