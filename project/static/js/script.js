/*
////////////////////////////////////////////////////////////////////
// Road Meet DeepGeo 0.3.0.alpha                                  //
// Copyright 2019 Lee Dong Gun (https://github.com/Sotaneum)      //
//                                                                //
// Creation Date : 2019.08.29                                     //
////////////////////////////////////////////////////////////////////
*/
const ROOT_PATH_BLACKBOX = "./data/blackbox/json/";
var is_traffic = true;
var is_mscoco = true;
function on_off_traffic(){
    if(is_traffic){
        ol_hide_features(ol_get_layer("blackbox"),"road-damage");
        is_traffic = false;
    }
    else{
        ol_show_features(ol_get_layer("blackbox"),"road-damage",null);
        is_traffic= true;
    }
}
function on_off_mscoco(){
    if(is_mscoco){
        ol_hide_features(ol_get_layer("blackbox"),"mscoco");
        is_mscoco = false;
    }
    else{
        ol_show_features(ol_get_layer("blackbox"),"mscoco",null);
        is_mscoco= true;
    }
}
/*
////////////////////////////////////////////////////////////////////
// API Connection (need jQuery)
////////////////////////////////////////////////////////////////////
*/

function getDataFormAJAX(URI, __func){
    $.ajax({
        type : 'GET',
        url : URI,
        crossDomain: true,
        success : function (e) {
            __func(e);
        },
        error : function(e){
            console.log(e);
        }
    });
}

function getGeoJSONFormAJAX(URI, __func, data){
    $.ajax({
        type : 'GET',
        url : URI,
        crossDomain: true,
        success : function (e) {
            __func(e, data);
        },
        error : function(e){
            console.log(e);
        }
    });
}

/*
////////////////////////////////////////////////////////////////////
// JSDrawViewer 0.0.1-alpha or higher
////////////////////////////////////////////////////////////////////
*/

//------------------------------------------------
// Function for JSDrawViewer System
//------------------------------------------------

function jsdrawviewer_load_video(g, uri, geojson){
    var properties = geojson.features[0].properties,
        width = properties.width,
        height = properties.height;
    
    g.load_video(uri, width, height).on("video","timeupdate", function(time, e){
        var d = [];
        $.each(geojson,function(i, item){
            if(i=='features'){
                if(geojson.features[0].properties.areaInImageJSON ==undefined)return;
                for(var j in geojson.features){
                    var feature = geojson.features[j].properties,
                        start=(feature.period[0])/1000,
                        end=(feature.period[1])/1000;
                    if(time>=start&time<end){
                        d.push(feature.areaInImageJSON.coordinates);
                    }
                }
            }
        });
        g.load_polygon(d);
    });
}

function jsdrawviewer_load_image(g, uri, geojson){
    var d = [];
    var properties = geojson.properties,
        width = properties.width,
        height = properties.height;
    for(var j in data.features){
        d.push(data.features[j].properties.areaInImageJSON.coordinates[0]);
    }
    g.load_image(uri,width,height,d);
}

/*
////////////////////////////////////////////////////////////////////
// OpenLayers 3 or higher
////////////////////////////////////////////////////////////////////
*/

//------------------------------------------------
// Variable for OpenLayers Style
//------------------------------------------------

var ol_style_black_box = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
            color: 'rgba(0,188,255, 1)'
            
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0,188,255, 0.4)'
        })
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0,188,255, 1)'
        
    }),
    fill: new ol.style.Fill({
        color: 'rgba(0,188,255, 0.4)'
    })
});

var ol_style_drone = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
            color: 'rgba(111, 0, 255, 1)'
            
        }),
        fill: new ol.style.Fill({
            color: 'rgba(111, 0, 255, 0.4)'
        })
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(111, 0, 255, 1)'
        
    }),
    fill: new ol.style.Fill({
        color: 'rgba(111, 0, 255, 0.4)'
    })
});

var ol_style_hover = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 10,
        stroke: new ol.style.Stroke({
            color: 'rgba(255,0,0, 1)'
            
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0, 0.4)'
        })
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(255,0,0, 1)'
        
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255,0,0, 0.4)'
    })
});

var ol_style_car = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
            color: 'rgba(255,0,0, 1)'
            
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0, 0.4)'
        })
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(255,0,0, 1)'
        
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255,0,0, 0.4)'
    })
});

var ol_style_traffic = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
            color: 'rgba(255,0,0, 1)'
            
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0, 0.4)'
        })
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(255,0,0, 1)'
        
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255,0,0, 0.4)'
    })
});

var ol_style_road_damage = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
            color: 'rgba(241, 64, 75, 0.3)'
        }),
        fill: new ol.style.Fill({
            color: 'rgba(241, 64, 75, 0.2)'
        })
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(241, 64, 75, 0.3)'
        
    }),
    fill: new ol.style.Fill({
        color: 'rgba(241, 64, 75, 0.2)'
    })
});

var ol_style_mscoco = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 2,
        stroke: new ol.style.Stroke({
            color: 'rgba(64, 241, 75, 0.3)'
        }),
        fill: new ol.style.Fill({
            color: 'rgba(64, 241, 75, 0.2)'
        })
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(64, 241, 75, 0.3)'
        
    }),
    fill: new ol.style.Fill({
        color: 'rgba(64, 241, 75, 0.2)'
    })
});

/*
var ol_style_car = new ol.style.Style({
    image: new ol.style.Icon( ({
        anchor: [0.5, 15],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        scale: 0.5,
        src: 'static/image/car.png'
    }))
});

var ol_style_traffic = new ol.style.Style({
    image: new ol.style.Icon( ({
        anchor: [0.5, 15],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        scale: 0.5,
        src: 'static/image/traffic.png'
    }))
});

var ol_style_road_damage = new ol.style.Style({
    image: new ol.style.Icon( ({
        anchor: [0.5, 15],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        scale: 0.5,
        src: 'static/image/fix.png'
    }))
});
*/

var ol_style_hide = new ol.style.Style({
    visibility : 'hidden',
    display : 'none'
});

//------------------------------------------------
// Variable for OpenLayers System
//------------------------------------------------

var map = null;
var point_stack_hover=[];
var ol_layout = {};

//------------------------------------------------
// Function for Openlayers System
//------------------------------------------------

function ol_init(target){
    map = new ol.Map({
        target: target,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    attributions: ['Powered by Esri',
                                   'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
                    attributionsCollapsible: false,
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    
            })})],
        view: new ol.View({
            center: ol.proj.fromLonLat([127.108995, 35.820325]),
            zoom: 16,
            maxZoom:17,
            minZoom:16
        })
    });

    map.getViewport().addEventListener("pointermove", function(e) {
        while(point = point_stack_hover.pop())
            point.f.setStyle(point.s);
        map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
            if (point_stack_hover.length == 0 && feature.getProperties().type!= "marker"){
                s = feature.getStyle(); 
                feature.setStyle(ol_style_hover);
                point_stack_hover.push({f:feature,s:s});
            }
        });
    });

    var container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');

    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        offset: [0, -10]
    });
    map.addOverlay(overlay);
    
    function ol_map_show_data(e, info){
        jsdrawviewer_load_video(info.g, info.video, e);
    }

    map.getViewport().addEventListener("click", function(e) {
        var feature = map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
            return feature;
        });
        if (feature) {
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();

            var ddd = ol.proj.transform(geometry.getCoordinates(), 'EPSG:3857','EPSG:4326');
            var html =  '<table>'+
                        '<tr><td>Long</td><td>'+ ddd[0] +'</td></tr>'+
                        '<tr><td>lat</td><td>'+ ddd[1] +'</td></tr>'+
                        '<tr><td>file name</td><td>'+ feature.get('file_name') +'</td></tr>'+
                        '<tr><td>category</td><td>'+ feature.get('category') +'</td></tr>';
            if(feature.get("annotationText") != undefined){
                var s = feature.get("areaInImageJSON")['coordinates'];
                var weight = (parseInt(s[1][0]) - parseInt(s[0][0])) + " * " + (parseInt(s[3][1]) - parseInt(s[0][1]));
                html+=  '<tr><td>text</td><td>'+ feature.get('annotationJSON')['className'] +'</td></tr>'+
                        '<tr><td>size</td><td>'+ weight +'</td></tr>';
            }
            
            html+='</table>';
            content_element.innerHTML = html;
            overlay.setPosition(coord);

            var file_path = ROOT_PATH_BLACKBOX +feature.get('category')+ "/" +feature.get('file_name').replace(".mp4","") + "_" + feature.get('category') + ".json";
            var info = {
                g : g,
                video:ROOT_PATH_BLACKBOX.replace("json","")+feature.get('file_name')
            };
            getGeoJSONFormAJAX(file_path, ol_map_show_data, info);
        }

    });
}

function ol_get_layer(key){
    return ol_layout[key];
}

function ol_add_layer(key){
    if(key in ol_layout) return;
    // VectorSource 
    var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON()
    });
    map.addLayer(new ol.layer.Vector({
        source: vectorSource
    }));
    ol_layout[key] = vectorSource;
}

function ol_select_style(layer, category, annotationText , style){
    if(layer in style){
        var sub_tab = style[layer];
        if(category in sub_tab){
            sub_sub_tab = sub_tab[category];
            if(annotationText in sub_sub_tab){
                return sub_sub_tab[annotationText];
            }else{
                return sub_sub_tab['default'];
            }
        }else{
            sub_tab['default'];
        }
    }else{
        return layer['default'];
    }
}

//------------------------------------------------
// Function for Openlayers Control
//------------------------------------------------

function ol_move_center_fromCoordinates(coordinates,zoom=17){
    map.getView().setCenter(coordinates);
    map.getView().setZoom(zoom);
}

function ol_move_center_fromlatlon(lat,lon,zoom=17){
    ol_move_center_fromlatlon(ol.proj.transform([lat, lon], 'EPSG:4326', 'EPSG:3857'), zoom);
}

function ol_move_center(lat, lon, zoom=17){
    ol_move_center_fromlatlon(lat,lon,zoom);
}

function ol_hide_features(vectorSource, category){
    var features = vectorSource.getFeatures();
    for(idx in features){
        var feature = features[idx];
        pro = feature.getProperties();
        if(pro.category == category){
            feature.setStyle(ol_style_hide);
        }
    }
}

function ol_show_features(vectorSource, category, style){
    var features = vectorSource.getFeatures();
    for(idx in features){
        var feature = features[idx];
        pro = feature.getProperties();
        if(pro.category == category){
            if(style == null){
                style = pro.style;
            }
            feature.setStyle(style);
        }
    }
}

//------------------------------------------------
// Function for Openlayers Insert Data
//------------------------------------------------

function ol_file_uri_reset(file_name, category , d){
    file_name = file_name.split("/");
    file_name = file_name[file_name.length-1];
    return d+category+"/"+file_name;
}

function ol_add_line(layout_key, latlons, properties, style_dict, category){
    if(category != "ori"){
        return;
    }

    var data = [],
        vectorSource = ol_get_layer(layout_key);
    for(var i =0;i<latlons.length;i+=2){
        data.push(ol.proj.transform([latlons[i], latlons[i+1]], 'EPSG:4326', 'EPSG:3857'));
    }
    var style = ol_select_style(layout_key, category, null,style_dict);
    var thing = new ol.geom.LineString(data);
    properties.type="line";
    properties.style=style;
    properties.category=category;
    properties.geometry = thing;
    var featurething = new ol.Feature(thing);
    featurething.setStyle(style);
    vectorSource.addFeature( featurething );
}

function ol_add_feature(layout_key, geojson, style_dict, category, a_geojson){
    var format = new ol.format.GeoJSON(),
        vectorSource = ol_get_layer(layout_key),
        style = null;

    if("annotationJSON" in geojson.properties){
        if(category=="mscoco" && geojson.properties.annotationJSON.className!="car"){
            return null;    
        }else{
            style = ol_select_style(layout_key, category, geojson.properties.annotationJSON.className,style_dict);
        }
    }
    else
        style = ol_select_style(layout_key, category, null,style_dict);

    file_name = geojson.properties.uri.split("/");
    file_name = file_name[file_name.length-1];
    folder = category.replace("_","/");
    geojson.properties.type="point";
    geojson.properties.category=category;
    geojson.properties.file_name = file_name;
    geojson.properties.style=style;
    geojson.properties.geojson = a_geojson;
    var feature =  format.readFeature(geojson, {
        featureProjection: 'EPSG:3857'
    });
    
    feature.setStyle(style);
    vectorSource.addFeature(feature);
    return geojson.geometry.coordinates;
}

function ol_add_features(layout_key, geojson, style, category){
    var ch = false;
    var data = [];
    var last = [-1, -1];
    for(var i=0;i<geojson.length;i++){
        if (ch)
            geojson[i].geometry.coordinates=geojson[i].geometry.coordinates[0];
        if (last[0] == geojson[i].geometry.coordinates[0] && last[1] == geojson[i].geometry.coordinates[0]){
            continue;
        }
        lonlat = ol_add_feature(layout_key, geojson[i], style, category, {"type":"FeatureCollection","features":geojson});
        if(lonlat == null){
            continue;
        }
        
        data.push(lonlat[0]);
        data.push(lonlat[1]);
        last=[geojson[i].geometry.coordinates[0], geojson[i].geometry.coordinates[0]];
    }
    return data;
}

function ol_load_geojson(layout_key, geojson, style, category, is_width_line){
    var g_type = geojson.type;
    if(g_type === "FeatureCollection"){
        var data = ol_add_features(layout_key, geojson.features, style, category);
        if(is_width_line===true){
            if(geojson.features.length > 1){
                var last_data = geojson.features[geojson.features.length-1].properties;
                var properties = {
                    "uri": last_data.uri,
                    "width": last_data.width,
                    "height": last_data.height,
                    "period": last_data.period
                };
                ol_add_line(layout_key, data, properties , style, category);
            }
        }
    }else if(g_type === "Feature"){
        ol_add_feature(layout_key, geojson, style);
    }else{
        console.log("지원하지 않은 GEOJSON 입니다.");
    }
}

/*
////////////////////////////////////////////////////////////////////
// JSTree 3.3.8 or higher
////////////////////////////////////////////////////////////////////
*/

//------------------------------------------------
// Variable for JSTree System
//------------------------------------------------

var jstree_selected_layout=[];

//------------------------------------------------
// Function for JSTree System
//------------------------------------------------

function jstree_list_cut(list){
    var list = list.filter(function(val) {
        val = val.replace("jstree_","")
        return val.split("")[0] != "j";
    });
    return list;
}

function jstree_init(target ,json){
    $(target).on('changed.jstree', function (e, data) {
            var now_selected = data.selected;
            compare = compareArray(jstree_selected_layout, now_selected);           
            hide_list = jstree_list_cut(compare[0]);
            show_list = jstree_list_cut(compare[1]);

            for(hide_idx in hide_list){
                hide = hide_list[hide_idx];
                hide_title = hide.replace("jstree_","");
                hide_category = hide_title.split("_")[0];
                hide_features(____layout[hide_category], hide_title);
            }
            
            for(show_idx in show_list){
                show = show_list[show_idx];
                show_title = show.replace("jstree_","");
                show_category = show_title.split("_")[0];
                show_features(____layout[show_category], show_title, null);
            }

            jstree_selected_layout = now_selected.slice();
        }).jstree({
        'core':{
            'data' : json
        },
        "checkbox" : {
            "keep_selected_style" : true
        },
        "plugins" : [ "wholerow", "checkbox" ]
    });
}

/*
////////////////////////////////////////////////////////////////////
// Normal Script
////////////////////////////////////////////////////////////////////
*/

//------------------------------------------------
// Function for DeepGeo
//------------------------------------------------

function set_size(g, width, height){
    var jsdr_width = width/100*40,
        jsdr_height = height/100*40;
    g.set_size(jsdr_width, jsdr_height);
}

function feature_edit(json, info){
    json.properties.uri = ol_file_uri_reset(json.properties.uri,info['layer'],info['data_path']);
}

function features_edit(json, info){
    for(var i in json.features){
        feature_edit(json.features[i], info);
    }
}

function geojson_edit(json, info){
    if(json.type==="FeatureCollection"){
        features_edit(json, info);
    }else{
        feature_edit(json, info);
    }
}
//----------------------------------------------------------------
// 중간에 데이터 정리 함수들 (임시)
//----------------------------------------------------------------

function feature_loaded(feature){
    var weight=0,
        classid=feature.properties.annotationJSON.classId,
        lat = feature.geometry.coordinates[0].toFixed(7),
        long = feature.geometry.coordinates[1].toFixed(7),
        coor = feature.properties.areaInImageJSON.coordinates,
        a = coor[0],
        b = coor[1],
        c = coor[3];

    weight = (b[0] - a[0]) * (c[1] - a[1]);
    
    return {
        "lat":lat,
        "long":long,
        "weight":weight,
        "id":classid
    };
}

function chk_float_chk(a,b, t){
    if(parseFloat(a) <= parseFloat(b)+parseFloat(t) && parseFloat(a) >= parseFloat(b)-parseFloat(t)){
        return true;
    }
    return false;
}

//23145
function chk_convert(real, a){
    var lat_t = 0.005,
        long_t = 0.005,
        weight_t = 10000;
    for(var i in real){
        for(var j in real[i]){
            var b = real[i][j];
            if(chk_float_chk(a.lat, b.lat, lat_t)){
                if(chk_float_chk(a.long, b.long, long_t)){
                    if(chk_float_chk(a.weight, b.weight, weight_t)){
                        return [true, real[i]];
                    }   
                }
            }        
        }
    }
    return [false, null];
}

function chk_couse(data){
    var lat=0,
        long=0,
        coor=[[0,0],[0,0],[0,0],[0,0],[0,0]],
        t_x = 0,
        t_y = 0;
    for(var i =0; i<data.length; i++){
        var fea_coor=data[i].feature.properties.areaInImageJSON.coordinates;
        lat += parseFloat(data[i].lat);
        long += parseFloat(data[i].long);
        coor[0][0]+=parseInt(fea_coor[0][0]);   
        coor[0][1]+=parseInt(fea_coor[0][1]);   
        coor[1][0]+=parseInt(fea_coor[1][0]);   
        coor[1][1]+=parseInt(fea_coor[1][1]);   
        coor[2][0]+=parseInt(fea_coor[2][0]);   
        coor[2][1]+=parseInt(fea_coor[2][1]);   
        coor[3][0]+=parseInt(fea_coor[3][0]);   
        coor[3][1]+=parseInt(fea_coor[3][1]);   
        coor[4][0]+=parseInt(fea_coor[4][0]);   
        coor[4][1]+=parseInt(fea_coor[4][1]);
        t_x += parseInt(data[i].feature.properties.period[0]);
        t_y += parseInt(data[i].feature.properties.period[1]);
    }
    lat = lat/data.length;
    long = long/data.length;
    coor[0][0]=coor[0][0]/data.length;   
    coor[0][1]=coor[0][1]/data.length;   
    coor[1][0]=coor[1][0]/data.length;   
    coor[1][1]=coor[1][1]/data.length;   
    coor[2][0]=coor[2][0]/data.length;   
    coor[2][1]=coor[2][1]/data.length;   
    coor[3][0]=coor[3][0]/data.length;   
    coor[3][1]=coor[3][1]/data.length;   
    coor[4][0]=coor[4][0]/data.length;   
    coor[4][1]=coor[4][1]/data.length;
    data[0].feature.geometry.coordinates=[lat,long];

    data[0].feature.properties.areaInImageJSON.coordinates=coor;
    t_x = parseInt(t_x/data.length)-100;
    t_y = parseInt(t_y/data.length)+100;
    //t_x = data[0].feature.properties.period[0];
    //t_y = data[data.length-1].feature.properties.period[1];
    data[0].feature.properties.period=[t_x,t_y];
    return data[0].feature;
}

function chk_some_id(data){
    var real = [[data[0]]],
        size = data.length;  
    for(var i=1;i<size;i++){
        var d= chk_convert(real, data[i]);
        if(d[0]==false){
            real.push([data[i]]); 
        }else{
            d[1].push(data[i]);
        }
    }
    var re = []
    for(var i in real){
        re.push(chk_couse(real[i]));
    }
    return re;
}

function big_event(geojson){
    if(geojson.type==="FeatureCollection"){
        var features = [];
        var chk = {};
        for(var i in geojson.features){
            var feature = geojson.features[i];
            var data = feature_loaded(feature);
            data.key=i;
            data.feature = feature;
            if(data.id in chk)
                chk[data.id].push(data);
            else
                chk[data.id]=[data];
        }
        for(var i in chk){
            chk[i] = chk_some_id(chk[i]);
            for(var j in chk[i]){
                features.push(chk[i][j]);
            }
        }
        return {
            "type": "FeatureCollection",
            "features": features
        };
    }else{
        return geojson;
    }
}

function callback_add_data(json, info){
    geojson_edit(json, info);
    ol_add_layer(info['layer']);
    // if(info['tag']!="ori")
    //     json = big_event(json);
    ol_load_geojson(info['layer'], json, info['style'],info['tag'],true);
}

function system_init(d){
    // json 데이터 Openlayers 에 등록
    for(var i in d['data']){
        var data = d['data'][i],
            root_path = d['data_folder'] + i + "/json/",
            category = data['catagory'];
        for(var j in category){
            var json_path = root_path;
            for(var k in data['file_name']){
                var file_path = "";
                if(category[j] == "ori"){
                    file_path = json_path + data['file_name'][k] + ".json";
                }
                else{
                    file_path = json_path + data['file_name'][k] + "_" + category[j] + ".json";
                }

                var info = {
                        "layer":i, //blackbox
                        "tag":category[j], //road-damage
                        "data_path" : d['data_folder'],
                        "style": d['style']['layer']
                    };
                getGeoJSONFormAJAX(file_path, callback_add_data, info);
            }
        }
    }
}

//------------------------------------------------
// Variable for DeepGeo UI
//------------------------------------------------

// JSDrawViewer RESET
var g = $.jsdrawviewer.create("#layout-viewer",1, 1);
// init g size
set_size(g, window.innerWidth, window.innerHeight);
$(window).resize(function() {
    set_size(g ,window.innerWidth,window.innerHeight);
});

// OpenLayers RESET
ol_init("fixed-ol-map");



//------------------------------------------------
// Variable for DeepGeo System
//------------------------------------------------
var system_data = {
    "data_folder":"./data/",
    "data":{
        "blackbox":{
            "catagory":[
                "ori",
                "road-damage",
                "mscoco"
            ],
            "file_name":[
                // "20190524_094900_NF",
                // "20190524_095001_NF",
                // "20190524_100759_NF",
                "20190524_100900_NF",
                "20190524_101001_NF",
                "20190524_101102_NF",
                "20190524_101203_NF",
                "20190524_101303_NF",
                "20190524_101404_NF",
                "20190524_101505_NF",
                "20190524_101605_NF",
                "20190524_101706_NF",
                "20190524_101807_NF",
                "20190524_101908_NF",
                "20190524_102009_NF",
                "20190524_102110_NF",
                "20190524_102211_NF",
                "20190524_102312_NF",
                "20190524_102413_NF",
                "20190524_102514_NF",
                "20190524_102615_NF",
                "20190524_102716_NF",
                "20190524_102817_NF",
                "20190524_102918_NF",
                "20190524_103019_NF",
                "20190524_103120_NF",
                "20190524_103220_NF",
                "20190524_103321_NF",
                "20190524_103422_NF",
                "20190524_103523_NF",
                "20190524_103623_NF",
                "20190524_103723_NF",
                "20190524_103824_NF",
                "20190524_103925_NF",
                "20190524_104026_NF",
                "20190524_104127_NF",
                "20190524_104228_NF",
                "20190524_104329_NF",
                "20190524_104430_NF",
                "20190524_104531_NF",
                "20190524_104632_NF",
                "20190524_104733_NF",
                // "20190524_104834_NF",
                "20190524_104935_NF",
                "20190524_105036_NF",
                "20190524_105137_NF",
                // "20190524_105238_NF",
                // "20190524_110941_NF",
                // "20190524_111042_NF",
                // "20190524_111142_NF",
                // "20190524_111243_NF",
                // "20190524_111344_NF",
                // "20190524_111445_NF",
                // "20190524_111546_NF",
                // "20190524_111647_NF",
                // "20190524_111748_NF",
                // "20190524_111849_NF",
                // "20190524_111950_NF",
                // "20190524_112051_NF",
                // "20190524_112152_NF",
                // "20190524_112253_NF",
                // "20190524_112354_NF",
                // "20190524_112454_NF",
                "20190524_112555_NF",
                // "20190524_112656_NF",
                // "20190524_112757_NF",
                // "20190524_112857_NF",
                // "20190524_112958_NF",
                // "20190524_113059_NF",
                // "20190524_113200_NF",
                // "20190524_113300_NF",
                // "20190524_113400_NF",
                // "20190524_113501_NF",
                // "20190524_113602_NF",
                "20190524_113703_NF",
                "20190524_113804_NF",
                "20190524_113905_NF",
                "20190524_114006_NF",
                "20190524_114107_NF",
                "20190524_114208_NF",
                "20190524_114309_NF",
                "20190524_114410_NF",
                "20190524_114511_NF",
                "20190524_114612_NF",
                "20190524_114713_NF",
                "20190524_114814_NF",
                "20190524_114915_NF",
                "20190524_115015_NF",
                "20190524_115116_NF",
                "20190524_115217_NF",
                "20190524_115318_NF",
                "20190524_115419_NF",
                "20190524_115520_NF",
                "20190524_115621_NF",
                "20190524_115722_NF",
                "20190524_115823_NF",
                "20190524_115924_NF",
                "20190524_120025_NF",
                "20190524_120126_NF",
                "20190524_120227_NF",
                "20190524_120328_NF",
                "20190524_120429_NF",
                "20190524_120530_NF",
                // "20190524_120631_NF",
                "20190524_120732_NF",
                "20190524_120833_NF",
                "20190524_120934_NF",
                "20190524_121035_NF",
                "20190524_121136_NF",
                "20190524_121237_NF",
                "20190524_121338_NF",
                "20190524_121439_NF",
                "20190524_121540_NF",
                "20190524_121641_NF",
                "20190524_121743_NF",
                "20190524_121844_NF",
                "20190524_121945_NF",
                // "20190524_122046_NF",
                "20190524_122147_NF",
                "20190524_122248_NF",
                "20190524_122349_NF",
                "20190524_122450_NF",
                "20190524_122551_NF",
                "20190524_122652_NF",
                "20190524_122753_NF",
                // "20190524_122854_NF",
                "20190524_122955_NF",
                // "20190524_123056_NF",
                // "20190524_131542_NF",
                // "20190524_131643_NF",
                // "20190524_131744_NF",
                // "20190524_131845_NF",
                // "20190524_131946_NF",
                // "20190524_132047_NF",
                // "20190524_132148_NF",
                // "20190524_132249_NF",
                // "20190524_132350_NF",
                "20190524_132451_NF",
                "20190524_132551_NF",
                "20190524_132652_NF",
                // "20190524_132753_NF",
                // "20190524_132854_NF",
                // "20190524_132955_NF",
                // "20190524_133056_NF",
                "20190524_133157_NF",
                "20190524_133258_NF",
                "20190524_133358_NF",
                "20190524_133458_NF",
                "20190524_133559_NF",
                "20190524_133700_NF",
                "20190524_133801_NF",
                "20190524_133902_NF",
                // "20190524_134003_NF",
                "20190524_134103_NF",
                "20190524_134204_NF",
                "20190524_134305_NF",
                "20190524_134406_NF",
                "20190524_134507_NF",
                "20190524_134608_NF",
                "20190524_134709_NF",
                "20190524_134810_NF",
                // "20190524_134911_NF",
                "20190524_135012_NF",
                "20190524_135113_NF",
                "20190524_135214_NF",
                "20190524_135315_NF",
                "20190524_135416_NF",
                // "20190524_135517_NF",
                "20190524_135618_NF",
                "20190524_135719_NF",
                "20190524_135820_NF",
                "20190524_135920_NF",
                "20190524_140021_NF",
                "20190524_140122_NF",
                "20190524_140223_NF",
                "20190524_140324_NF",
                "20190524_140425_NF",
                "20190524_140526_NF",
                "20190524_140627_NF",
                "20190524_140728_NF",
                "20190524_140829_NF",
                "20190524_140930_NF",
                "20190524_141031_NF",
                "20190524_141132_NF",
                "20190524_141233_NF",
                "20190524_141334_NF",
                "20190524_141435_NF",
                "20190524_141536_NF",
                // "20190524_141637_NF",
                "20190524_141922_NF",
                "20190524_142023_NF",
                "20190524_142124_NF",
                "20190524_142225_NF",
                "20190524_142326_NF",
                "20190524_142427_NF",
                "20190524_142528_NF",
                "20190524_142629_NF",
                "20190524_142730_NF",
                "20190524_142831_NF",
                "20190524_142932_NF",
                "20190524_143033_NF",
                "20190524_143134_NF",
                "20190524_143235_NF",
                "20190524_143336_NF",
                "20190524_143437_NF",
                "20190524_143538_NF",
                "20190524_143639_NF",
                "20190524_143739_NF",
                "20190524_143840_NF",
                "20190524_143941_NF",
                "20190524_144042_NF",
                "20190524_144143_NF",
                "20190524_144244_NF",
                "20190524_144345_NF",
                "20190524_144446_NF",
                "20190524_144547_NF",
                "20190524_144647_NF",
                "20190524_144748_NF",
                "20190524_144849_NF",
                "20190524_144950_NF",
                "20190524_145051_NF",
                "20190524_145152_NF",
                "20190524_145253_NF",
                "20190524_145354_NF",
                "20190524_145455_NF",
                "20190524_145556_NF",
                "20190524_145656_NF"
            ]
        }
    },
    "style":{
        "layer":{
            "default":ol_style_hide,
            "blackbox":{
                "default":ol_style_hide,
                "ori":{
                    "default":ol_style_black_box
                },
                "road-damage":{
                    "default":ol_style_road_damage
                },
                "mscoco":{
                    "default":ol_style_mscoco
                }
            }
        }
    }
}

// RUN SYSTEM
system_init(system_data);