
(function() {
    if (window.hasInjectedScript) {
        return;
    }
    window.hasInjectedScript = true;
	
	function injectWarpOutOfRange(proto,graphics_constructor)
	{
		// replace the original drawWarpOutOfRangeRectangle function with the same function, but use grey instead black for the lineStyle (background)
		// the Graphics class isn't available in the context of the extension, so use the _Graphics prototype from stationaryFleetCircles
		
		proto.drawWarpOutOfRangeRectangle=function(br,gr) {

			const vr = this.coordinatesToLocal(br, gr)
			  , _r = this.getLocationForCoordinates(vr[0], vr[1] + 1)
			  , xr = new graphics_constructor
			  , $r =6842472
			  , Sr = this.tileSize / 20;
			xr.lineStyle(3, $r, 1, 0, !0),
			xr.eventMode = "none",
			xr.beginFill($r),
			xr.moveTo(_r[0] + Sr, _r[1] - Sr),
			xr.lineTo(_r[0] - Sr + this.tileSize, _r[1] - Sr),
			xr.lineTo(_r[0] - Sr + this.tileSize, _r[1] + Sr - this.tileSize),
			xr.lineTo(_r[0] + Sr, _r[1] + Sr - this.tileSize),
			xr.lineTo(_r[0] + Sr, _r[1] - Sr),
			xr.endFill(),
			xr.alpha = .25,
			this.warpOverlayTilesContainer.addChild(xr),
			this.warpOverlayTiles.set([br, gr].toString(), xr)
		
		};				
		
	}

	// Old code: get graphics object via stationaryFleetCircles
	/*	
	var injectDone=false;
	
	// check if stationaryFleetCircles has a filled map, otherwise exit (and try it again later)
	function checkAndInject()
	{
		if(injectDone) return;
		// find the WarpMapViewModel object
		var map=window.__RK_Global_Container._registry._registryMap;
		var arr=Array.from(map.keys());
		var usekey=0;
		arr.forEach(function(value,index) { if(value.name=="WarpMapViewModel") usekey=index; });

		// get the graphics object through the stationaryFleetCircles object
		if(typeof map.get(arr[usekey])[0].instance.stationaryFleetCircles.entries().next().value == 'undefined')
			console.log('Not found');
		else
		{
			injectDone=true;
			console.log('Found');
			injectWarpOutOfRange(map.get(arr[usekey])[0].provider.useClass.prototype,map.get(arr[usekey])[0].instance.stationaryFleetCircles.entries().next().value[1].constructor);
		}
	}
	
	// try to inject the new function after 3 seconds, if it fails, try it again every second (max 20 seconds)
	for(var i=3000; i<=20000; i+=1000)
		setTimeout(function() { checkAndInject(); },i);
	*/
	
	
	// search and get the WarpMapViewModel object
	var map=window.__RK_Global_Container._registry._registryMap;
	var arr=Array.from(map.keys());
	var usekey=0;
	arr.forEach(function(value,index) { if(value.name=="WarpMapViewModel") usekey=index; });

	// set a location, this will also set the "graphics" object in "selectedLocation" and we can get it from there
	map.get(arr[usekey])[0].instance.setSelectedLocation(0, 0);
	
	// inject our modified function
	const proto=map.get(arr[usekey])[0].provider.useClass.prototype;
	const graphics_constructor=map.get(arr[usekey])[0].instance.selectedLocation.graphics.constructor;
	injectWarpOutOfRange(proto,graphics_constructor);
	
	// we have the object now, reset to default: no location selected
	map.get(arr[usekey])[0].instance.deselectSelectedLocation();
	
	// get rid of the glow effect around the star map, we search for 2 objects in "backgroundJpegsContainer" with a height of 8400 and remove them.
	var jpegs=map.get(arr[usekey])[0].instance.backgroundJpegsContainer.children;
	var index=jpegs.length-1;
	while(index>=0)
	{
		if(jpegs[index]._texture && jpegs[index]._texture.orig && jpegs[index]._texture.orig.height==8400)
			jpegs.splice(index,1);
		index-=1;
	}
	
	// done
		
})();
