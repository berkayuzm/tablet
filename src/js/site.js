
$(".vehicle-other-action-buttons").hide();

$(".other-buttons").on("click", function () {
    $(".vehicle-other-action-buttons").show();
    $(".vehicle-action-buttons").hide();
});

$(".focus-button").on("click", function () {
    var icon = $(".focus-button i");
    if (icon.hasClass("iconoir-pin")) {
        icon.removeClass("iconoir-pin").addClass("iconoir-pin-slash");
    } else {
        icon.removeClass("iconoir-pin-slash").addClass("iconoir-pin");
    }
});

$(".vehicle-action-button.other-buttons-back").on("click", function () {
    $(".vehicle-other-action-buttons").hide();
    $(".vehicle-action-buttons").show();
});

$(".modal-header .iconoir-xmark").on("click", function () {
    $(".modal-container, .modal-ip").hide();
});

$(".settings-button .iconoir-settings").on("click", function () {
    $(".modal-shutdown").hide();
    $(".modal-start-symphony").hide();
    $(".modal-container, .modal-ip").show();
});

$(".logo .iconoir-system-shut").on("click", function () {
    $(".modal-ip").hide();
    $(".modal-start-symphony").hide();
    $(".modal-container, .modal-shutdown").show();
});

//VOLKANIN YAZDIĞI KOD
// $("#start_button").on("click", function () {
//     var buttonText = $("#start_button .text span");
//     if (buttonText.html() === "Görev Modunu Kapat") {
//         continueMission();
//         buttonText.html("Görev Modunu Aç");
//         $(".sidebar .vehicle-action-buttons .vehicle-action-button.open-mission-mode-button").css("border-color", "#17e217");
//         $(".sidebar .vehicle-action-buttons .vehicle-action-button.open-mission-mode-button").css("color", "#17e217");
//     } else {
//         freezeMission();
//         buttonText.html("Görev Modunu Kapat");
//         $(".sidebar .vehicle-action-buttons .vehicle-action-button.open-mission-mode-button").css("border-color", "#e93030");
//         $(".sidebar .vehicle-action-buttons .vehicle-action-button.open-mission-mode-button").css("color", "#e93030");
//     }
// });
// Durumu değiştirmek için bir tıklama işleyicisi ekle
$(".vehicle-action-button #start-symphony-button").on("click", function () {
    // Tıklanan düğmenin türünü belirleyin (start veya stop)
    var buttonType = $(this).hasClass("start-symphony-button") ? "start" : "stop";

    // Duruma göre düğmelerin görünürlüğünü ayarlayın
    if (buttonType === "start") {
        $(".start-symphony-button").hide();
        $(".stop-symphony-button").show();
        stopSymphony();
    } else {
        $(".stop-symphony-button").hide();
        $(".start-symphony-button").show();
        startSymphony();
    }
});

let dimension = localStorage.getItem('boyut');

$("#open_rviz").on("click", function () {
    if (dimension !== null) {
        dimension = dimension === 'true';
        dimension = !dimension;
    }
    else {
        dimension = true;
    }
    localStorage.setItem('boyut', dimension);
    window.location.reload(false);
});

$("#ip-change-cancel-button").on("click",()=>{
    $("#ip-change-modal").hide();
})
$("#change-ip-button").on("click",()=>{

    $("#ip-change-modal").show();
})
$("#set-ip-button").on("click",()=>{

    $("#ip-change-modal").show();
    
})

$("#send-car-button").on("click",()=>{
    $("#send-car-modal").show()
})
$("#send-car-close-button").on("click",()=>{
    $("#send-car-modal").hide()
})

$(".slide-button").on("click",()=>{
    if($(".sidebar").width()>0){
 
        
        $(".vehicle-information, .vehicle-cards, .vehicle-action-buttons, .vehicle-other-action-buttons").animate({ opacity: 0 },200, ()=>{
            $(".vehicle-information").hide();
            $(".vehicle-cards").hide();
            $(".vehicle-action-buttons").hide();
            $(".vehicle-other-action-buttons").hide();
            $("#map").animate({width:"100%"},()=>{
                viewer.width = $("#map").width();
                viewer.height=$("#map").height();
                viewer.resize(viewer.width, viewer.height);
            })
            $(".sidebar").animate({width: '0px',padding:"0px"});
            $(".slide-button").html(`<i class="bi bi-chevron-right"></i>`)
    
        });


    }
    else{
        $(".slide-button").html(`<i class="bi bi-chevron-left"></i>`)
        $(".sidebar").animate({width: '30%',padding:"10px"});
        $("#map").animate({width:"70%"},()=>{
            viewer.width = $("#map").width();
            viewer.height=$("#map").height();
            viewer.resize(viewer.width, viewer.height);
        },()=>{
            $(".vehicle-information").show();
            $(".vehicle-cards").show();
            $(".vehicle-action-buttons").show();
            if($(".vehicle-other-action-buttons").css("display")!="none"){
                $(".vehicle-other-action-buttons").show();
            }
            $(".vehicle-information, .vehicle-cards, .vehicle-action-buttons, .vehicle-other-action-buttons").animate({ opacity:1},350);
        })

    }
})

$(".send-car-button").on("click",()=>{
    $("#send-car-modal").hide();
})


function blinkElement() {
    $(".sidebar .vehicle-information p").fadeIn(1000).fadeOut(1000, blinkElement);
}

blinkElement();
// Tıklama olayını dinleme
