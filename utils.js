var utils = {

    convertDateToEpoch: function(datestring){
        var m = datestring.match(/^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s*$/);
        return Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6])/1000;
    },

    getEpochFromDate: function(d){
        var now_utc = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),  d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
        var epoch = (now_utc.getTime()-now_utc.getMilliseconds())/1000;
        return epoch;
    },

    extractMinutesFromDateStr: function(datestring){
        var d = new Date(datestring);
        var h = d.getHours()*60*60;
        var m = d.getMinutes()*60;
        var s = d.getSeconds();
        return h + m + s;
    },

    twoRangesMatch: function(startts, endts, startValue, endValue) {
        var constraintMet = false;
        if (startts != null && endts != null){
            if (startts <= startValue
                &&
                endts >= endValue ) {

                constraintMet = true;
            }
        }
        else if (startts != null) {
            if (startts <= startValue) {
                constraintMet = true;
            }
        }
        else if (endts != null) {
            if (endts >= endValue) {
                constraintMet = true;
            }
        }
        else if( startts == null && endts == null){
            constraintMet = true;
        }

        return constraintMet;
    },


    valueIsInRange: function(start, end, mainValue){
        var constraintMet = false;

        if (start != null && end != null) {
            if( start <= mainValue && end >= mainValue ) {
                constraintMet = true;
            }
        }
        else if (start != null) {
            if (start <= mainValue) {
                constraintMet = true;
            }
        }
        else if (end != null) {
            if (end >= mainValue) {
                constraintMet = true;
            }
        }
        else if( start == null && end == null){
            constraintMet = true;
        }

        return constraintMet;
    },

    getCheckedElements: function(form) {
        var cbResults = [];
        for (var i = 0; i < form.elements.length; i++ ) {
            if (form.elements[i].type == 'checkbox') {
                if (form.elements[i].checked == true) {
                    cbResults.push(form.elements[i].value);
                }
            }
        }
        return cbResults;
    },

    getDateRange: function(startElem, endElem) {
        var result = null;
        var startPicker = startElem.pickadate("get");
        var startts = null;
        if (startPicker != '') {
            var start = new Date(startPicker);
            startts = this.getEpochFromDate(start);
        }

        var endPicker = endElem.pickadate("get");
        var endts = null;
        if (endPicker != '') {
            var end = new Date(endPicker);
            endts = this.getEpochFromDate(end);
        }

        if (startts !== null || endts != null) {
            result = {
                start: startts,
                end: endts
            }
        }

        return result;
    },

    getTimeRange: function(startElem, endElem) {
        var result = null;

        var startTime = startElem.timepicker("getSecondsFromMidnight");
        var endTime = endElem.timepicker("getSecondsFromMidnight");

        if (startTime !== null || endTime != null) {
            result = {
                start: startTime,
                end: endTime
            }
        }
        return result;
    },

    getValueRange: function(startElem, endElem) {
        var result = null;

        var start = startElem.val();
        var end = endElem.val();

        if (start !== '' || end != '') {
            result = {
                start: start,
                end: end
            }
        }
        return result;
    }
}