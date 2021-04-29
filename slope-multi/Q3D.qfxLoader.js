THREE.Q3D_qfxLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

	this.withCredentials = false;

};

THREE.Q3D_qfxLoader.prototype = Object.create( THREE.Loader.prototype );

THREE.Q3D_qfxLoader.prototype.load = function ( url, callback /*, texturePath*/ ) {

	var scope = this;

	// todo: unify load API to for easier SceneLoader use

	//texturePath = texturePath && ( typeof texturePath === 'string' ) ? texturePath : this.extractUrlBase( url );

	//this.onLoadStart();
	this.loadAjaxJSON( this, url, callback /*, texturePath*/ );

};

THREE.Q3D_qfxLoader.prototype.loadAjaxJSON = function ( context, url, callback /*, texturePath*/ ,callbackProgress ) {

	var xhr = new XMLHttpRequest();

	var length = 0;

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === xhr.DONE ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				if ( xhr.responseText ) {
					//http://stackoverflow.com/questions/3512471/non-capturing-group
					//alert("Q3D.qfxLoader : CONTENT FOLLOWS \n\n"+xhr.responseText);
					var vertexShader = xhr.responseText;
					//var rexp = /<vertexShader>([\s\S]+?)<\/vertexShader>/
					//alert(vertexShader.match(rexp));
					context.objify(xhr.responseText);
					//alert(vertexShader);
					//var json = JSON.parse( xhr.responseText );
					//alert(json.TEST)

					/*if ( json.metadata !== undefined && json.metadata.type === 'scene' ) {

						console.error( 'Q3D.qfxLoader: "' + url + '" seems to be a Scene. Use THREE.SceneLoader instead.' );
						return;

					}*/

					//var result = context.parse( json, texturePath );
					var result = context.objify(xhr.responseText);
					//callback( result.geometry, result.materials );
					callback(result);

				} else {

					console.error( 'Q3D.qfxLoader: "' + url + '" seems to be unreachable or the file is empty.' );

				}

				// in context of more complex asset initialization
				// do not block on single failed file
				// maybe should go even one more level up

				context.onLoadComplete();

			} else {

				console.error( 'Q3D.qfxLoader: Couldn\'t load "' + url + '" (' + xhr.status + ')' );

			}

		} else if ( xhr.readyState === xhr.LOADING ) {

			if ( callbackProgress ) {

				if ( length === 0 ) {

					length = xhr.getResponseHeader( 'Content-Length' );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {

			if ( callbackProgress !== undefined ) {

				length = xhr.getResponseHeader( 'Content-Length' );

			}

		}

	};

	xhr.open( 'GET', url, true );
	xhr.withCredentials = this.withCredentials;
	xhr.send( null );

};

THREE.Q3D_qfxLoader.prototype.objify = function (txt){ // parse .qfx file text which is in an XML-like style (not actually XML, since it would make newlines and < or > illegal, this circumvents needing escape characters in GLSL for < > etc, and needing XML root node.)

	var parsed = {};
	var chr;
	var lastChr;
	var state = 0;
	var save = [];
	var save2 = [];
	var currTag ="";
	var checkTag = "";
	var strContent = "";
	var returnObj;
	
	// state = 0 is used when searching for first <
	// state = 1 is used when searching for second >

	for (var i = 0, len = txt.length; i < len; i++) {
		chr = txt.charAt(i);
		// search for brackets which aren't spanning newlines
		if(state === 0){ // expects format is followed, otherwise crazy bugs ensue.
			
			if(chr === "<"){
				save.push(i);
				state = 1;
			};
			
		}else if(state === 1){
			
			if(chr === "\n" || chr === "\r" || chr === "\r\n" || chr === "\n\r"){
				save.length = 0;
				state = 0;
			};
			
			if(chr === ">"){
				save.push(i);
				currTag = txt.substring(save[0]+1, save[1]).replace(/ /g,''); // find the opening tag name, stripping white-space out.
				state = 2;
			};
			
		}else if(state === 2){
		
			if(chr === "/" && lastChr === "<"){
				save2.push(i);
				state = 3;
			};
		
		}else if(state === 3){
		
			if(chr === "\n" || chr === "\r" || chr === "\r\n" || chr === "\n\r"){
				save2.length = 0;
				// remain in state 3, still searching for closing tag
			};
			
			if(chr === ">"){
				save2.push(i);
				checkTag = txt.substring(save2[0]+1, save2[1]).replace(/ /g,''); // find the closing tag name, stripping white-space out.

				if(checkTag === currTag){
					strContent = txt.substring(save[1]+1, save2[0]-1) //get the string contained between the tags.
					parsed[currTag] = strContent;
					state = 0;
					save.length = 0;
				};
				save2.length = 0;		

				
			};
		
		}
		
		lastChr = chr; //save the last chr found, useful for finding "</" in tag close
		
	};
	
	// process file into a shader material object to be returned
	
	if(parsed.hasOwnProperty("shadertype")){
		
		parsed.shadertype = parsed.shadertype.replace(/[\s]/g,'');
		returnObj = new THREE[parsed.shadertype]();

	}else return false
	
	if(parsed.hasOwnProperty("vertexshader")){
	
		returnObj.vertexShader = parsed.vertexshader;
	
	}else return false
	
	if(parsed.hasOwnProperty("fragmentshader")){
	
		returnObj.fragmentShader = parsed.fragmentshader;
	
	}else return false
	
	if(parsed.hasOwnProperty("uniforms")){
		
		parsed.uniforms = eval(parsed.uniforms) //might be a security risk, but i don't see how its any less secure than the console, just really not sure how to do it otherwise
		parsed.uniforms = parsed.uniforms.uniformCall();
		
		returnObj.uniforms = parsed.uniforms;
		
	}
	
	if(parsed.hasOwnProperty("attributes")){
		
		parsed.attributes = eval(parsed.attributes) //might be a security risk, but i don't see how its any less secure than the console, just really not sure how to do it otherwise
		
		returnObj.attributes = parsed.attributes;

	}
	
	if(parsed.hasOwnProperty("defines")){
		
		parsed.defines = eval(parsed.defines) //might be a security risk, but i don't see how its any less secure than the console, just really not sure how to do it otherwise
		
		returnObj.defines = parsed.defines;

	}
	
	
	return returnObj;
	
	/*var key
	for(key in parsed){
		alert("[ "+key+" ]"+"\n\n"+parsed[key]);
	}*/

};