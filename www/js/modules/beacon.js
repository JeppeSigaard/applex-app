app.beacon = {
    
    debug : function(result){
       $('#beacon-data').append(JSON.stringify(result));
    },
    
    startMonitoring : function(uuid, identifier, major, minor){
        var delegate = new cordova.plugins.locationManager.Delegate();
        cordova.plugins.locationManager.setDelegate(delegate);
        
        delegate.didDetermineStateForRegion = function (pluginResult) {
            app.log('State determined: ' + JSON.stringify(pluginResult));
            cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log('didStartMonitoringForRegion:', pluginResult);
            app.log('Monitoring started:' + JSON.stringify(pluginResult));
        };

        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            app.log('Ranged: ' + JSON.stringify(pluginResult));
        };
        
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
        
        
        cordova.plugins.locationManager.requestWhenInUseAuthorization();
        cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion).fail(function(e) { console.error(e); app.log(e); }).done();
    },
    
    stopMonitoring : function(uuid, identifier, major, minor){
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
        
        cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegion)
        .fail(function(e) { console.error(e); })
        .done();
    },
    
    startRanging : function(uuid, identifier, major, minor){
        
        var delegate = new cordova.plugins.locationManager.Delegate();

        
        delegate.didDetermineStateForRegion = function (pluginResult) {
            //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didStartMonitoringForRegion: ' + JSON.stringify(pluginResult));
        };
        
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            //cordova.plugins.locationManager.appendToDeviceLog('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
            app.log(pluginResult);
        };
        

        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

        cordova.plugins.locationManager.setDelegate(delegate);
        cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion).fail(function(e) { console.error(e); app.log(e);}).done();
    },
    
    stopRanging : function(uuid, identifier, major, minor){
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

        cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion).fail(function(e) { console.error(e); app.log(e); }).done();
    }
};