     $(function() {
        $('.inlinepie').sparkline('html', {type: 'pie', width: '165', height: '165', sliceColors: ['#8e86bc', '#3bafda', '#00b19d']} );
        $('.inlinebar').sparkline('html', {type: 'bar', height: '165', barWidth: '10', barSpacing: '3', barColor: '#3bafda'} );
    });