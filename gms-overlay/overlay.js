var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -27.6267801, lng: -48.6860732},
		zoom: 10
	});

	world = new World();

	// palhoça
	// var coords_tr = latLngDstMath(-27.62556, -48.68497, 10000, 8500);
	// var coords_bl = latLngDstMath(-27.63007, -48.69, -5000, -6500);
	// jv fine tuning
	var coords_tr = latLngDstMath(-27.62556, -48.68497, 10000+150000-250, 8500-15000);
	var coords_bl = latLngDstMath(-27.63007, -48.69, -5000+150000-250, -6500-15000);
	world.genRegions({lat_tr: coords_tr.lat, lng_tr: coords_tr.lng, lat_bl: coords_bl.lat, lng_bl: coords_bl.lng});
}

function latLngDstMath(lat, lng, dst_lat, dst_lng) {
	var new_lat = lat + dst_lat * 0.0000089;
	var new_lng = lng + dst_lng * 0.0000089 / Math.cos(lat * 0.01745329251);

	return {lat: new_lat, lng: new_lng};
}

class Area {
	constructor(area_info, bounds) {
		this.area_info = area_info;
		this.bounds = bounds;
		this.rectangle = new google.maps.Rectangle({
			strokeColor: '#000000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillOpacity: 0,
			visible: false,
			map: map,
			bounds: new google.maps.LatLngBounds(
				new google.maps.LatLng(bounds.lat_bl, bounds.lng_bl),
				new google.maps.LatLng(bounds.lat_tr, bounds.lng_tr)
			)
		});

		// TODO Add click listener
		var r = this.rectangle;
		this.rectangle.addListener('click', function(e) {
			r.setOptions({fillColor: '#0000FF', fillOpacity: 0.35});
		});

		google.maps.event.addListener(map, 'zoom_changed', function() {
			if(map.zoom < 14) {
				r.setOptions({visible: false});
			} else {
				r.setOptions({visible: true});
			}
		})
	}
}

class Route {
	constructor(route_info, bounds) {
		this.route_info = route_info;
		this.bounds = bounds;
		this.rectangle = new google.maps.Rectangle({
			strokeColor: '#000000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillOpacity: 0,
			visible: false,
			map: map,
			bounds: new google.maps.LatLngBounds(
				new google.maps.LatLng(bounds.lat_bl, bounds.lng_bl),
				new google.maps.LatLng(bounds.lat_tr, bounds.lng_tr)
			)
		});

		var r = this.rectangle;
		this.rectangle.addListener('click', function(e) {
			r.setOptions({fillColor: '#FF0000', fillOpacity: 0.35});
		});

		google.maps.event.addListener(map, 'zoom_changed', function() {
			if(map.zoom >= 14 || map.zoom <= 11) {
				r.setOptions({visible: false});
			} else {
				r.setOptions({visible: true});
			}
		})

		this.genAreas();
	}

	genAreas() {
		var areas = [];
		for(var i = 0; i < 10; i++) {
			for(var j = 0; j < 10; j++) {
				var c_tr = latLngDstMath(this.bounds.lat_tr, this.bounds.lng_tr, -i*500, -j*500);
				var c_bl = latLngDstMath(this.bounds.lat_tr, this.bounds.lng_tr, -(i+1)*500, -(j+1)*500);

				areas.push(new Area({}, {lat_bl: c_bl.lat, lng_bl: c_bl.lng, lat_tr: c_tr.lat, lng_tr: c_tr.lng}));
			}
		}
	}
}

class Region {
	constructor(region_info, bounds) {
		this.region_info = region_info;
		this.bounds = bounds;
		this.rectangle = new google.maps.Rectangle({
			strokeColor: '#000000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillOpacity: 0,
			map: map,
			bounds: new google.maps.LatLngBounds(
				new google.maps.LatLng(bounds.lat_bl, bounds.lng_bl),
				new google.maps.LatLng(bounds.lat_tr, bounds.lng_tr)
			)
		});

		var r = this.rectangle;
		this.rectangle.addListener('click', function(e) {
			r.setOptions({fillColor: '#00FF00', fillOpacity: 0.35});
		});

		google.maps.event.addListener(map, 'zoom_changed', function() {
			console.log(map.getZoom());
			if(map.zoom > 11) {
				r.setOptions({visible: false});
			} else {
				r.setOptions({visible: true});
			}
		})

		this.genRoutes();
	}

	genRoutes() {
		var routes = [];
		for(var i = 0; i < 3; i++) {
			for(var j = 0; j < 3; j++) {
				var c_tr = latLngDstMath(this.bounds.lat_tr, this.bounds.lng_tr, -i*5000, -j*5000);
				var c_bl = latLngDstMath(this.bounds.lat_tr, this.bounds.lng_tr, -(i+1)*5000, -(j+1)*5000);

				routes.push(new Route({}, {lat_bl: c_bl.lat, lng_bl: c_bl.lng, lat_tr: c_tr.lat, lng_tr: c_tr.lng}));
			}
		}
	}
}

class World {
	constructor() {
		this.world_info = {}
	}

	// Placeholder method
	genRegions(bounds) {
		var region = new Region({name: 'lalala'}, bounds);
	}
}