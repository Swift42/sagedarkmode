
(async function() {
    if (window.hasInjectedScript) {
        return;
    }
    window.hasInjectedScript = true;

	function injectdrawJpegTiles(proto)
	{		
		const drawJpegTilesSaved = proto.drawJpegTiles;
		proto.drawJpegTiles=async function() {
			await drawJpegTilesSaved.call(this);
			const response = await fetch("chrome-extension://jbbcimnnhecbonhmjfmejmmfkoocmbcc/my-map-hires.jpg");
			const imageBlob = await response.blob();
			const image = await createImageBitmap(imageBlob);	
			console.log(this.backgroundJpegsContainer);
			this.backgroundJpegsContainer.children[0].texture=this.backgroundJpegsContainer.children[0].texture.constructor.from(image);
			this.backgroundJpegsContainer.children[0].x=this.tileSize*-2;
			this.backgroundJpegsContainer.children[0].y=this.tileSize*-2;
			this.backgroundJpegsContainer.children[0].width=this.tileSize*105;
			this.backgroundJpegsContainer.children[0].height=this.tileSize*105;
		};						
	}

	function injectdrawJpegOldTiles(proto)
	{		
		async function loadImage(name)
		{
			const response = await fetch("chrome-extension://jbbcimnnhecbonhmjfmejmmfkoocmbcc/"+name);
			const imageBlob = await response.blob();
			return(await createImageBitmap(imageBlob));
		}
		const drawJpegOldTilesSaved = proto.drawJpegOldTiles;
		proto.drawJpegOldTiles=async function() {
			await drawJpegOldTilesSaved.call(this);
			const mce=await loadImage('map-column-even.png');
			const mco=await loadImage('map-column-odd.png');
			const mbo=await loadImage('map-border-odd.png');
			const ecl=await loadImage('extend-column-left.png');
			const ecr=await loadImage('extend-column-right.png');

			var index=this.backgroundJpegsContainer.children.length-1;			
			while(index>=0)
			{
				if(this.backgroundJpegsContainer.children.at(index)._texture.label)
				{
					if(this.backgroundJpegsContainer.children.at(index)._texture.label.includes('map-column-odd')) 
						this.backgroundJpegsContainer.children.at(index).texture=this.backgroundJpegsContainer.children[0].texture.constructor.from(mco);
					else if(this.backgroundJpegsContainer.children.at(index)._texture.label.includes('map-column-even')) 
						this.backgroundJpegsContainer.children.at(index).texture=this.backgroundJpegsContainer.children[0].texture.constructor.from(mce);
					else if(this.backgroundJpegsContainer.children.at(index)._texture.label.includes('map-border-odd')) 
						this.backgroundJpegsContainer.children.at(index).texture=this.backgroundJpegsContainer.children[0].texture.constructor.from(mbo);
					else if(this.backgroundJpegsContainer.children.at(index)._texture.label.includes('extend-column-left')) 
						this.backgroundJpegsContainer.children.at(index).texture=this.backgroundJpegsContainer.children[0].texture.constructor.from(ecl);
					else if(this.backgroundJpegsContainer.children.at(index)._texture.label.includes('extend-column-right')) 
						this.backgroundJpegsContainer.children.at(index).texture=this.backgroundJpegsContainer.children[0].texture.constructor.from(ecr);
				}
				else
				{
					this.backgroundJpegsContainer.children.splice(index,1);					
				}
				index-=1;
			}
		};						
	}
	
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
	
	function injectFee(proto)
	{		
		proto.getPriorityFee=function(rr) {
			return console.debug(this.connectionModel.cluster.httpEndPoint), this.cuSettings.minPriorityFee
		};		
	}

	
	// search and get the WarpMapViewModel object
	var map=window.__RK_Global_Container._registry._registryMap;
	var arr=Array.from(map.keys());
	var usekey=0;
  var usekey_th=0;
	arr.forEach(function(value,index) 
	{ 
		if(value.name=="WarpMapViewModel") usekey=index;
    if(value.name=="StarAtlasTransactionHandler") usekey_th=index;
	});
	
	map.get(arr[usekey])[0].instance.setSelectedLocation(0, 0);
	
	// inject our modified functions
	const proto=map.get(arr[usekey])[0].provider.useClass.prototype;
	const graphics_constructor=map.get(arr[usekey])[0].instance.selectedLocation.graphics.constructor;
	injectWarpOutOfRange(proto,graphics_constructor);
	injectdrawJpegTiles(proto);
	injectdrawJpegOldTiles(proto);

 	const proto_th=map.get(arr[usekey_th])[0].provider.useClass.prototype;
	injectFee(proto_th);
  
	map.get(arr[usekey])[0].instance.deselectSelectedLocation();
		
})();
