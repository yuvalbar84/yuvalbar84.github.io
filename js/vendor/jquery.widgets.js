$(document).ready(function () {

  var DrawSparkline = function () {

    $('.inlinesparkline').sparkline({
      type: 'pie',
      width: '165',
      height: '165',
      sliceColors: ['#dcdcdc', '#3bafda', '#333333', '#00b19d']
    });

    $('#inlinesparkline2').sparkline({
      type: 'bar',
      height: '165',
      barWidth: '10',
      barSpacing: '3',
      barColor: '#3bafda'
    });

  },
    DrawMouseSpeed = function () {
      var mrefreshinterval = 500; // update display every 500ms
      var lastmousex = -1;
      var lastmousey = -1;
      var lastmousetime;
      var mousetravel = 0;
      var mpoints = [];
      var mpoints_max = 30;
      $('html').mousemove(function (e) {
        var mousex = e.pageX;
        var mousey = e.pageY;
        if (lastmousex > -1) {
          mousetravel += Math.max(Math.abs(mousex - lastmousex), Math.abs(mousey - lastmousey));
        }
        lastmousex = mousex;
        lastmousey = mousey;
      });
      var mdraw = function () {
        var md = new Date();
        var timenow = md.getTime();
        if (lastmousetime && lastmousetime != timenow) {
          var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
          mpoints.push(pps);
          if (mpoints.length > mpoints_max)
            mpoints.splice(0, 1);
          mousetravel = 0;
          $('#sparkline5').sparkline(mpoints, {
            tooltipSuffix: ' pixels per second',
            type: 'line',
            width: '100%',
            height: '165',
            chartRangeMax: 50,
            lineColor: '#3bafda',
            fillColor: 'rgba(59,175,218,0.3)',
            highlightLineColor: 'rgba(24,147,126,.1)',
            highlightSpotColor: 'rgba(24,147,126,.2)'
          });
        }
        lastmousetime = timenow;
        setTimeout(mdraw, mrefreshinterval);
      }
      // We could use setInterval instead, but I prefer to do it this way
      setTimeout(mdraw, mrefreshinterval);
    };

  DrawSparkline();
  DrawMouseSpeed();

  var resizeChart;

  $(window).resize(function (e) {
    clearTimeout(resizeChart);
    resizeChart = setTimeout(function () {
      DrawSparkline();
      DrawMouseSpeed();
    }, 300);
  });
});