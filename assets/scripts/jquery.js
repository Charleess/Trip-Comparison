$(document).ready(function(){
    $("span.nav-toggle").click(function(){
        $("div.nav-menu").toggleClass("is-active");
    });

    $("li.mode_actuel_toggle").click(function(){
        $(".mode_actuel_toggle").removeClass('is-active')
        $("div.dropdown_car").addClass('is-hidden')
        $(this).addClass('is-active')
    })

    $("li.mode_compare_toggle").click(function(){
        $(".mode_compare_toggle").removeClass('is-active')
        $(this).addClass('is-active')
    })

    $("li.car_toggle.mode_actuel_toggle").click(function(){
        $("div.dropdown_car.mode_actuel").toggleClass("is-hidden")
    })

    $("li.dropdown_car_item.mode_actuel").click(function(){
        $("#mode_actuel_voiture").text(() => $(this).text())
        $("div.dropdown_car.mode_actuel").toggleClass("is-hidden")
    })

    $("li.car_toggle.mode_compare_toggle").click(function(){
        $("div.dropdown_car.mode_compare").toggleClass("is-hidden")
    })

    $("li.dropdown_car_item.mode_compare").click(function(){
        $("#mode_compare_voiture").text(() => $(this).text())
        $("div.dropdown_car.mode_compare").toggleClass("is-hidden")
    })

    $("body").keyup(function(key){
        $("div.dropdown_car.mode_compare").addClass("is-hidden")
        $("div.dropdown_car.mode_actuel").addClass("is-hidden")
    })

    $("div.notification.is-danger > button").click(function(){
        $(this).parent().addClass("is-hidden");
    })
});