$(".lift").each(function() {
    var row = $(this);

    // Update table on input
    $(this).find("input").on("input", function (e) {
        var pr = parseInt($(this).val());
        var tm = pr*0.9;
        row.find(".weight-100").html(tm);
        for (var i = 40; i < 100; i += 5) {
            var weight = Math.round(tm*i/100/2.5)*2.5;
            row.find(".weight-"+i).html(weight);
        }
    });

    // Store cookie on text change
    $(this).find("input").on("change", function (e) {
        var pr = parseInt($(this).val());
        var cookie = [row.attr("lift"), "=", pr, "; path=/;"].join("");
        console.debug(cookie);
        document.cookie = cookie;
    });
});

//
// TODO: this is copy-pasted from strength.js
//
// http://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name, defaultValue) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
    return defaultValue;
}

$("#inputBenchpress").val(getCookie("Benchpress", 120)).trigger("input");
$("#inputPress").val(getCookie("Press", 75)).trigger("input");
$("#inputDeadlift").val(getCookie("Deadlift", 175)).trigger("input");
$("#inputFrontsquat").val(getCookie("Frontsquat", 110)).trigger("input");
$("#inputBacksquat").val(getCookie("Backsquat", 120)).trigger("input");
