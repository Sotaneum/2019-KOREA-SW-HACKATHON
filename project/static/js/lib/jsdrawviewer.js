/*
Copyright 2019 Kim Young Ji, LEE Dong Gun.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(
    function (factory){
        if (typeof define === 'function' && define.amd){
            define(['jquery'], factory);
        }
        else if(typeof module !== 'undefined' && module.exports) {
            module.exports = factory(require('jquery'));
        }
        else {
            factory(jQuery);
        }
    }
    (
        function($, undefined){
            /*
             * jsDrawViewer 0.0.1-alpha
             * http://jsDrawViewer.com/
             * 
             * copyright (c) 2019 Kim Young Ji, LEE Dong Gun(http://blog.naver.com/cyydo96).
             * Licensed same as jquery - under the terms of the MIT License
             */

            // 중복 include 방지
            if($.jsdrawviewer){
                return;
            }
            
            // 내부 변수 설정
            var doc = window.document, // 코드 길이 최소화
                instance_counter = 0; // 인스턴스 개수

            /**
             * jsdrawviewer 관련 기능 및 인스턴스 생성, 액세스 조작을 위한 실제 클래스
             * @name $.jsdrawviewer
             */
            $.jsdrawviewer = {
                /**
                 * 현재 js 파일의 버전을 표시합니다.
                 * @name $.jsdrawviewer.version
                 */
                version : '0.0.1-alpha'
            };

            /**
             * jsdrawviewer 인스턴스를 생성
             * @name $.jsdrawviewer.create(el, [, options])
             * @param {DOMElement|jQuery|String} el 인스턴스를 생성할 dom 객체이거나 jquery 객체이거나 string이면 됩니다.
             * @return {jsDrawViewer} 새로운 인스턴스를 반환합니다.
             */
            $.jsdrawviewer.create = function (el, width, height){
                var tmp = new $.jsdrawviewer.core(++instance_counter);
                $(el).data('jsdrawviewer', tmp);
                tmp.init(el, width, height);
                return tmp;
            };
            /**
             * cont
             */
            $.jsdrawviewer.core = function(id){
                this._id = id;
                this._data = {
                    type : null,
                    width : null,
                    height : null,
                    real_w : null,
                    real_h : null,
                    x_ratio : null,
                    y_ratio : null,
                    polygons : null,
                    element : null,
                    svg : null,
                    media : null,
                    colors : null,
                    in_event : null,
                    is_play : null,
                    interval_current_time: null,
                    interval_auto_resize:null,
                    current_time:null,
                    src:null
                }
            };
            $.jsdrawviewer.core.prototype = {
                init : function(el, width, height){
                    // 변수 설정
                    this.element = $(el);
                    this.element.html('<object></object><svg xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>');
                    this.svg = $(el).children("svg");
                    this.media = $(el).children("object");
                    this.colors = ["rgba(0,0,0,0.5)","rgba(0,0,0,1)"];
                    this.in_event = {"video":{},"image":{}}
                    this.is_play = true;
                    this.current_time=0;
                    this._interval_video_time();
                    // 크기 초기화
                    this.set_size(width, height);
                    
                    return this;
                },
                destroy : function (keep_html){
                    
                },
                _to_size : function(size, is_resize){
                    var result = size;
                    if(typeof size != 'string'){
                        result = size+"px";
                    }
                    if(is_resize==undefined || is_resize==null){
                        return result;
                    }
                    clearInterval(this.interval_auto_resize);
                    var _this = this;
                    this.interval_auto_resize = setInterval(() => {

                        this.set_size()
                    }, 1);
                },
                set_size : function(width, height, is_resize){
                    this.width = this._to_size(width, is_resize);
                    this.height = this._to_size(height, is_resize);
                    this._reset_ratio();
                    this.svg.css({
                        "width": this.width,
                        "height": this.height,
                        "position": "absolute",
                        "margin":"0px",
                        "padding":"0px"
                    });                     
                    this.media.css({
                        "width": this.width,
                        "height": this.height,
                        "position": "absolute",
                        "margin":"0px",
                        "padding":"0px"
                    });
                    this.element.css({
                        "width": this.width,
                        "height": this.height,
                        "position": "absolute",
                        "margin":"0px",
                        "padding":"0px"
                    });
                    
                    if(this.type=="image"){
                        this.media.children("img").css({
                            "width": this.width,
                            "height": this.height,
                            "margin":"0px",
                            "padding":"0px"
                        });
                    }else if(this.type=="video"){
                        this.media.children("video").css({
                            "width": this.width,
                            "height": this.height,
                            "margin":"0px",
                            "padding":"0px"
                        });
                    }
                    this.draw_polygons(this.colors);
                    return this;
                },
                draw_polygons : function(colors){
                    if(this.polygons!=undefined && this.polygons!=null){
                        this.load_polygon(this.polygons, colors);
                    }
                    return this;
                },
                _random_colors : function(){
                    var cnt = this.polygons.length;
                    var res = []
                    for(var i=0;i<cnt;i++){
                        var color = 'rgba(';
                        for (var j = 0; j < 3; j++) {
                            color += Math.floor(Math.random() * 256)+",";
                        }
                        res.push([color+"0.4)", color+"1)"]);
                    }
                    return res;
                },
                load_polygon : function(polygons, colors){
                    this.polygons = polygons;
                    this.colors = colors;
                    this._reset_ratio(); 
                    if(colors == undefined || colors == null){
                        colors = this._random_colors();
                        this.colors = colors;
                    }
                    this.svg.html(this._polygons(polygons));
                    return this;
                },
                get_time : function(){
                    return this.current_time;
                },
                _interval_video_time : function(callback){
                    var _this = this;
                    clearInterval(_this.interval_current_time);
                    _this.interval_current_time = setInterval(function () {
                        var video = _this.media.children("video").get(0);
                        if(video != undefined && video != null){
                            if(_this.current_time != video.currentTime){
                                _this.current_time = video.currentTime;
                                if(callback != undefined && callback != null)
                                    callback(_this.current_time, _this);
                            }
                        }
                    }, 0.001);
                },
                _polygons : function(_ps){
                    var polygons = ''
                    for (var p in _ps) polygons+=this._polygon(_ps[p], this.colors[p][0], this.colors[p][1]);
                    return polygons;
                },
                _polygon : function(_p, fill, stroke){
                    var coor='';
                    var __p = _p;
                    for (var k in __p){
                        coor += __p[k][0]*this.x_ratio+','+__p[k][1]*this.y_ratio+' ';
                    }
                    return '<polygon points="' + coor + '" style="fill:'+fill+'; stroke:'+stroke+'; stroke-width:2" />';
                },
                _loading : function(){
                    var image = $('<img class="jsdrawviewer_loading" width="64px" height="64px" src="data:image/png;base64, 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">');
                    function rotate(obj, degree) {
                        if(degree>3600){
                            degree = degree%360;
                        }
                        obj.css({
                            "-webkit-transform": "rotate("+degree+"deg)",
                            "-moz-transform": "rotate("+degree+"deg)",
                            "transform": "rotate("+degree+"deg)", /* For modern browsers(CSS3)  */
                            "position": "absolute",
                            "top":"calc(50% - 32px)",
                            "left":"calc(50% - 32px)"
                        });
                        if(image == undefined)return;                 
                        timer = setTimeout(function() {
                            degree+=3; rotate(obj, degree);
                        },0.1);
                    }
                    rotate(image, 0);
                    if(this.media.html() != ""){
                        var jsdrawviewer__ = this;
                        this.media.children().fadeOut("fast", function(){
                            jsdrawviewer__.media.append(image);
                        });
                        this.svg.html('');
                    }
                    else{
                        this.media.append(image);
                    }
                    return image;
                },
                move_frame : function(msec){
                    var video = this.media.children("video");
                    if(video==undefined || video==null) return;
                    video.get(0).currentTime = (msec+1)/1000;
                    return this;
                },
                _reset_ratio : function(){
                    width = parseInt(this.width.substring(0, this.width.length-2));
                    height = parseInt(this.height.substring(0, this.height.length-2));
                    this.x_ratio = width/this.real_w;
                    this.y_ratio = height/this.real_h;
                },
                load_image : function(src, width, height, polygons){
                    var _this = this;
                    var loading = _this._loading();
                    var media = _this.media;
                    var img = $("<img src='"+src+"' width="+this.width+" height="+this.height+">");
                    this.src = src;
                    img.on('load', function() {
                        loading.fadeOut("fast", function() {
                            _this.type = "image";
                            _this.polygons = polygons;
                            _this.real_w = width;
                            _this.real_h = height;
                            _this._reset_ratio();
                            _this.draw_polygons();
                            media.empty();
                            media.append(img);
                        });
                    });
                    return this;
                },
                load_video : function(src, width, height, polygons){
                    var _this = this;
                    var loading = _this._loading();
                    var media = _this.media;
                    this.src = src;
                    var video = $('<video width="'+ this.width + '" height="' + this.height + '" muted><source src="'+src+'" type="video/mp4"></video>');
                    video.css({
                        "object-fit": "fill"
                    });                   
                    video.on('loadedmetadata', function() {
                        loading.fadeOut("fast", function() {
                            _this.type = "video";
                            _this.polygons = polygons;
                            _this.real_w = width;
                            _this.real_h = height;
                            _this._reset_ratio();
                            _this.draw_polygons();
                            media.empty();
                            media.append(video);
                            _this._set_event(video);
                            if(_this.is_play)
                                _this.play();
                            else
                                _this.pause();
                        });
                    });
                    return this;
                },
                _set_event : function(obj){
                    var event_list = this.in_event[this.type];
                    for (var key in event_list) {
                        if(key == "timeupdate"){
                            this._interval_video_time(event_list[key]);
                        }else{
                            obj.on(key, $.proxy(event_list[key], obj.get(0), this));
                        }
                    }
                },
                _text : function(text){

                },
                get_src:function(){
                    return this.src;
                },
                play:function(){
                    var video = this.media.children("video").get(0);
                    this.is_play = true;
                    if(video != undefined && video != null){
                        video.play();
                    }
                },
                pause:function(){
                    var video = this.media.children("video").get(0);
                    this.is_play = false;
                    if(video != undefined && video != null){
                        video.pause();
                    }
                },
                on : function(type, e_name, func){
                    this.in_event[type][e_name] = func;
                },
                get_container : function(){
                    return this.element;
                }
            };

            
        }
    )
);