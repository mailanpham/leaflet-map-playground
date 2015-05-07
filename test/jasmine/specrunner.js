require.config({
    baseUrl: "../../",
    //urlArgs: 'cb=' + Math.random(),
    shim: {
        underscore: {
            exports: '_'
        },
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'widget': {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: 'assets/js/jquery-1.9.1.min',
        underscore: 'assets/js/underscore-min',
        text: 'text',
        jasmine: 'test/jasmine/lib/jasmine-1.3.1/jasmine',
        'jasmine-html': 'test/jasmine/lib/jasmine-1.3.1/jasmine-html',
        spec: 'test/jasmine/spec'
    }
});

require(['jquery', 'jasmine-html'], function($, jasmine){
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    specs.push('spec/helpers/util_test');

    $(function(){
        require(specs, function(){
            jasmineEnv.execute();
        });
    });
});
