function dummyData() {
    var mydata = [
        {
            key: "Bench press",
            values: [
                ["2013/10/31", 90],
                ["2013/11/18", 100],
                ["2014/03/01", 110],
                ["2014/06/19", 120]
            ]
        },
        {
            key: "Press",
            values: [
                ["2013/10/20", 55],
                ["2013/11/15", 62],
                ["2014/03/04", 70],
                ["2014/06/17", 77.5]
            ]
        },
        {
            key: "Deadlift",
            values: [
                ["2013/09/24", 110],
                ["2013/11/13", 130],
                ["2014/03/05", 150],
                ["2014/06/15", 165]
            ]
        },
        {
            key: "Front squat",
            values: [
                ["2013/11/02", 85],
                ["2013/11/19", 90],
                ["2014/03/12", 100],
                ["2014/06/20", 110]
            ]
        },
        {
            key: "Back squat",
            values: [
                ["2013/10/17", 85],
                ["2013/11/16", 100],
                ["2014/03/03", 125],
                ["2014/06/18", 135]
            ]
        },
    ];
    return mydata;
}

function redrawTable() {
    console.debug("redrawTable");
    $("#tblPr > tbody").empty();
    for (var i = 0; i < theData.length; ++i) {
        var liftData = theData[i];
        for (var j = 0; j < liftData.values.length; ++j) {
            var row = $("<tr>")
                .append($("<td>").html(liftData.key))
                .append($("<td>").html(liftData.values[j][0]))
                .append($("<td>").html(liftData.values[j][1]))
                .append($("<td>")
                    .append($("<button>")
                        .attr("class", "btn btn-danger btn-delete")
                        .click(inception(i, j))
                        .append(btnDeleteString)
                    )
                );
            $("#tblPr").find("tbody").append(row);
        }
    }
}

function inception(i, j) {
    return function() {
        console.debug(i + " " + j);
        theData[i].values.splice(j, 1);
        redrawTable();
    }
}

function parse(str) {
    if(!/^\d{4}\/\d{2}\/\d{2}$/.test(str)) return "invalid date";
    var y = str.substr(0,4),
            m = str.substr(5,2),
            d = str.substr(8,2);
    return new Date(y,m,d).getTime();
}

function plotGraph() {
    nv.addGraph(function() {
        var chart = nv.models.lineChart()
            //.useInteractiveGuideline(true)
            .x(function (d) {
                return parse(d[0]);
            })
            .y(function (d) {
                return d[1];
            })
            .showYAxis(true)
            .margin({left: 100, right: 100})
        ;

        var dateFormatter = function(d) { return d3.time.format("%x")(new Date(d)) };
        chart.xAxis
            .axisLabel("Date")
            .tickFormat(dateFormatter);
            ;

        chart.yAxis
            .axisLabel("Weight (kg)")
            .tickFormat(d3.format(",r"))
            ;

        d3.select("#chart svg")
            .datum(theData)
            .transition().duration(500)
            .call(chart)
            ;

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

$("#btnClear").click(function() {
    theData = [];
    redrawTable();
});
$("#btnPlotGraph").click(plotGraph);
$("#btnAdd").click(function() {
    var lift = $("#inputLiftType").val();
    var date = $("#inputDate").val();
    var weight = parseInt($("#inputWeight").val(), 10);

    console.debug(lift);
    console.debug(date);
    console.debug(weight);

    // TODO: check format

    var idx = -1;
    for (var i = 0; i < theData.length; ++i) {
        if (theData[i].key == lift) {
            idx = i;
            break;
        }
    }
    if (idx === -1) {
        theData.push({key: lift, values: [[date, weight]]});
    } else {
        theData[i].values.push([date, weight]);
    }
    redrawTable();
});

$("#btnSaveCookie").click(function() {
    // http://stackoverflow.com/questions/191881/serializing-to-json-in-jquery
    var cookie = ["theData=", JSON.stringify(theData), "; path=/;"].join("");
    console.debug(cookie);
    //
    // This won"t work unless Chrome is started with --enable-file-cookies
    // http://stackoverflow.com/questions/6232331/setting-cookies-using-javascript-in-a-local-html-file
    // 
    // On, OS/X, start with:
    // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-file-cookies
    //
    document.cookie = cookie;
});

// http://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

window.onload = function() {
    console.debug(document.cookie);
    var cookie = getCookie("theData");
    console.debug(cookie);
    if (cookie) {
        theData = JSON.parse(cookie);
    } else {
        theData = dummyData();
    }
    redrawTable();
    plotGraph();
}
