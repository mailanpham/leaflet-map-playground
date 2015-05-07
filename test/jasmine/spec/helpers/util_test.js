define([
    'jquery',
    'underscore',
    'utils' //nothing returned
], function ($, _) {
    describe('Tests for utility helper', function(){

        beforeEach(function() {
        });

        afterEach(function() {
            $('#sandbox').remove();
        });

        it("date strings should convert to epoch timestamp", function() {
            var dateStr = '2014-04-01 03:04:55';
            var expectedResult = 1396321495;

            var formatted = utils.convertDateToEpoch(dateStr);

            expect(formatted).toEqual(expectedResult);
        });

        it("Date() should convert to epoch timestamp", function() {
            var dateStr = new Date("4 May, 2014");
            var expectedResult = 1399212000;

            var formatted = utils.getEpochFromDate(dateStr);

            expect(formatted).toEqual(expectedResult);
        });

        it("Date string should extract time in minutes", function() {
            var dateStr = "2014-04-01 03:04:55";
            var expectedResult = 11095;

            var formatted = utils.extractMinutesFromDateStr(dateStr);

            expect(formatted).toEqual(expectedResult);
        });

        it("twoRangesMatch: start and end falls within startValue and endValue, should be true", function() {
            var start = 0;
            var end = 10;
            var startValue = 1;
            var endValue = 4;
            var expectedResult = true;

            var result = utils.twoRangesMatch(start, end, startValue, endValue);

            expect(result).toEqual(expectedResult);
        });

        it("twoRangesMatch: start and end's range is lower on number line than startValue and endValue range, should be false", function() {
            var start = 0;
            var end = 10;
            var startValue = 20;
            var endValue = 500;
            var expectedResult = false;

            var result = utils.twoRangesMatch(start, end, startValue, endValue);

            expect(result).toEqual(expectedResult);
        });

        it("twoRangesMatch: end is null, start value is less than or equal to startValue range, should be true", function() {

            var start = 3;
            var end = null;
            var startValue = 3;
            var endValue = 100;
            var expectedResult = true;

            var result = utils.twoRangesMatch(start, end, startValue, endValue);

            expect(result).toEqual(expectedResult);
        });

        it("twoRangesMatch: end is null, start value greater than startValue range, should be false", function() {
            var start = 3;
            var end = null;
            var startValue = 1;
            var endValue = 2;
            var expectedResult = false;

            var result = utils.twoRangesMatch(start, end, startValue, endValue);

            expect(result).toEqual(expectedResult);
        });

        it("twoRangesMatch: start is null, end value equal to endValue range, should be true", function() {
            var start = null;
            var end = 10;
            var startValue = 1;
            var endValue = 10;
            var expectedResult = true;

            var result = utils.twoRangesMatch(start, end, startValue, endValue);

            expect(result).toEqual(expectedResult);
        });

        it("twoRangesMatch: start is null, end value greater than endValue range, should be false", function() {
            var start = null;
            var end = 10;
            var startValue = 27;
            var endValue = 40;
            var expectedResult = false;

            var result = utils.twoRangesMatch(start, end, startValue, endValue);

            expect(result).toEqual(expectedResult);

        });

        it("twoRangesMatch: start is null, end is null, should be true", function() {
            var start = null;
            var end = null;
            var startValue = 1;
            var endValue = 2;
            var expectedResult = true;

            var result = utils.twoRangesMatch(start, end, startValue, endValue);

            expect(result).toEqual(expectedResult);
        });


        it("valueIsInRange: start is 0, end is 10, value is 1, should be true", function() {
            var start = 0;
            var end = 10;
            var value = 1;
            var expectedResult = true;

            var result = utils.valueIsInRange(start, end, value);

            expect(result).toEqual(expectedResult);
        });


        it("valueIsInRange: start is 0, end is 10, value is 20, should be false", function() {
            var start = 0;
            var end = 10;
            var value = 20;
            var expectedResult = false;

            var result = utils.valueIsInRange(start, end, value);

            expect(result).toEqual(expectedResult);
        });


        it("valueIsInRange: null end in range, with value >= start, should be true, ", function() {

            var start = 3;
            var end = null;
            var value = 3;
            var expectedResult = true;

            var result = utils.valueIsInRange(start, end, value);

            expect(result).toEqual(expectedResult);

            var start = 3;
            var end = null;
            var value = 6;
            var expectedResult = true;

            var result = utils.valueIsInRange(start, end, value);

            expect(result).toEqual(expectedResult);
        });

        it("valueIsInRange: null end in range, with a value less than start, should be false ", function() {

            var start = 3;
            var end = null;
            var value = 1;
            var expectedResult = false;

            var result = utils.valueIsInRange(start, end, value);

            expect(result).toEqual(expectedResult);
        });

        it("valueIsInRange: null start and end range should have be true for match found", function() {
            var start = null;
            var end = null;
            var value = 1;
            var expectedResult = true;

            var result = utils.valueIsInRange(start, end, value);

            expect(result).toEqual(expectedResult);
        });


    });

});
