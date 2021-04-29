///////////////////////////// As three.js is updated, the creators like to add and remove functionality, which sometimes breaks things that depend on that old functionality.
// their motivation is good (sometimes) but ends up an annoyance when trying to migrate, so old functionality that's needed is stored in this file.
// Old features that have new behaviour have "Old" prefixed to them, since this maintains both in the code.

//////////////////////////////////////// FEATURES IN THIS DOCUMENT
/*

- CombinedCamera, copied from r66
- BoxHelper from r66, copied from r68, renamed OldBoxHelper

*/

//////////////////////////// Combined Camera was removed in THREE r68, so i need to add it (code copied but modified a lot from THREE r66)
		
THREE.CombinedCamera = function ( width, height, fov, near, far, orthoNear, orthoFar ) {

	THREE.Camera.call( this );

	this.fov = fov;

	/*this.left = -width / 2;
	this.right = width / 2
	this.top = height / 2;
	this.bottom = -height / 2;*/

	// We could also handle the projectionMatrix internally, but just wanted to test nested camera objects

	this.cameraO = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 	orthoNear, orthoFar );
	this.cameraP = new THREE.PerspectiveCamera( fov, width / height, near, far );

	this.zoom = 1;
	this.aspect = width/height;
	this.width = width;
	this.height = height;

	this.toPerspective();



};

THREE.CombinedCamera.prototype = Object.create( THREE.Camera.prototype );

/*THREE.CombinedCamera.prototype.toPerspective = function () {

	// Switches to the Perspective Camera

	this.near = this.cameraP.near;
	this.far = this.cameraP.far;

	this.cameraP.fov =  this.fov / this.zoom ;

	this.cameraP.updateProjectionMatrix();

	this.projectionMatrix = this.cameraP.projectionMatrix;

	this.inPerspectiveMode = true;
	this.inOrthographicMode = false;

};*/

/*THREE.CombinedCamera.prototype.toOrthographic = function () {

	// Switches to the Orthographic camera estimating viewport from Perspective

	var fov = this.fov;
	var aspect = this.cameraP.aspect;
	var near = this.cameraP.near;
	var far = this.cameraP.far;

	// The size that we set is the mid plane of the viewing frustum

	//var hyperfocus = ( near + far ) / 2;

	var halfHeight = Math.tan( fov / 2 ); //* hyperfocus;
	var planeHeight = 2 * halfHeight;
	var planeWidth = planeHeight * aspect;
	var halfWidth = planeWidth / 2;

	halfHeight /= this.zoom;
	halfWidth /= this.zoom;

	this.cameraO.left = -halfWidth;
	this.cameraO.right = halfWidth;
	this.cameraO.top = halfHeight;
	this.cameraO.bottom = -halfHeight;

	// this.cameraO.left = -farHalfWidth;
	// this.cameraO.right = farHalfWidth;
	// this.cameraO.top = farHalfHeight;
	// this.cameraO.bottom = -farHalfHeight;

	// this.cameraO.left = this.left / this.zoom;
	// this.cameraO.right = this.right / this.zoom;
	// this.cameraO.top = this.top / this.zoom;
	// this.cameraO.bottom = this.bottom / this.zoom;

	this.cameraO.updateProjectionMatrix();

	this.near = this.cameraO.near;
	this.far = this.cameraO.far;
	this.projectionMatrix = this.cameraO.projectionMatrix;

	this.inPerspectiveMode = false;
	this.inOrthographicMode = true;

};*/

THREE.CombinedCamera.prototype.toOrthographic = function () {

	this.cameraO.near=this.near
	this.cameraO.far=this.far;
	
	this.cameraO.left = -this.width/2;
	this.cameraO.right = this.width/2;
	this.cameraO.top = this.height/2;
	this.cameraO.bottom = -this.height/2;

	this.cameraO.updateProjectionMatrix();

	this.projectionMatrix = this.cameraO.projectionMatrix;

	this.inPerspectiveMode = false;
	this.inOrthographicMode = true;

};

THREE.CombinedCamera.prototype.toPerspective = function () {

	this.cameraP.near = this.near
	this.cameraP.far = this.far;
	this.cameraP.aspect = this.aspect;

	this.cameraP.fov =  this.fov; //   /this.zoom ;

	this.cameraP.updateProjectionMatrix();

	this.projectionMatrix = this.cameraP.projectionMatrix;

	this.inPerspectiveMode = true;
	this.inOrthographicMode = false;

};

THREE.CombinedCamera.prototype.setSize = function( width, height ) {

	this.cameraP.aspect = width / height;
	this.left = -width / 2;
	this.right = width / 2
	this.top = height / 2;
	this.bottom = -height / 2;

};


THREE.CombinedCamera.prototype.setFov = function( fov ) {

	this.fov = fov;

	if ( this.inPerspectiveMode ) {

		this.toPerspective();

	} else {

		this.toOrthographic();

	}

};

// For mantaining similar API with PerspectiveCamera

THREE.CombinedCamera.prototype.updateProjectionMatrix = function() {

	if ( this.inPerspectiveMode ) {

		//this.toPerspective();
		this.cameraP.updateProjectionMatrix();

	} else {

		//this.toPerspective();
		//this.toOrthographic();
		this.cameraO.updateProjectionMatrix();

	}

};

/*
* Uses Focal Length (in mm) to estimate and set FOV
* 35mm (fullframe) camera is used if frame size is not specified;
* Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
*/
THREE.CombinedCamera.prototype.setLens = function ( focalLength, frameHeight ) {

	if ( frameHeight === undefined ) frameHeight = 24;

	var fov = 2 * THREE.Math.radToDeg( Math.atan( frameHeight / ( focalLength * 2 ) ) );

	this.setFov( fov );

	return fov;
};


THREE.CombinedCamera.prototype.setZoom = function( zoom ) {

	this.zoom = zoom;

	if ( this.inPerspectiveMode ) {

		this.toPerspective();

	} else {

		this.toOrthographic();

	}

};

THREE.CombinedCamera.prototype.toFrontView = function() {

	this.rotation.x = 0;
	this.rotation.y = 0;
	this.rotation.z = 0;

	// should we be modifing the matrix instead?

	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toBackView = function() {

	this.rotation.x = 0;
	this.rotation.y = Math.PI;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toLeftView = function() {

	this.rotation.x = 0;
	this.rotation.y = - Math.PI / 2;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toRightView = function() {

	this.rotation.x = 0;
	this.rotation.y = Math.PI / 2;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toTopView = function() {

	this.rotation.x = - Math.PI / 2;
	this.rotation.y = 0;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};

THREE.CombinedCamera.prototype.toBottomView = function() {

	this.rotation.x = Math.PI / 2;
	this.rotation.y = 0;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;

};	
	
//////////////////////////// Box Helper was changed in THREE r68, so i need to add the old one back (code copied directly from THREE r66)

THREE.OldBoxHelper = function ( object ) {

	//   5____4
	// 1/___0/|
	// | 6__|_7
	// 2/___3/

	var vertices = [
		new THREE.Vector3(   1,   1,   1 ),
		new THREE.Vector3( - 1,   1,   1 ),
		new THREE.Vector3( - 1, - 1,   1 ),
		new THREE.Vector3(   1, - 1,   1 ),

		new THREE.Vector3(   1,   1, - 1 ),
		new THREE.Vector3( - 1,   1, - 1 ),
		new THREE.Vector3( - 1, - 1, - 1 ),
		new THREE.Vector3(   1, - 1, - 1 )
	];

	this.vertices = vertices;

	// TODO: Wouldn't be nice if Line had .segments?

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		vertices[ 0 ], vertices[ 1 ],
		vertices[ 1 ], vertices[ 2 ],
		vertices[ 2 ], vertices[ 3 ],
		vertices[ 3 ], vertices[ 0 ],

		vertices[ 4 ], vertices[ 5 ],
		vertices[ 5 ], vertices[ 6 ],
		vertices[ 6 ], vertices[ 7 ],
		vertices[ 7 ], vertices[ 4 ],

		vertices[ 0 ], vertices[ 4 ],
		vertices[ 1 ], vertices[ 5 ],
		vertices[ 2 ], vertices[ 6 ],
		vertices[ 3 ], vertices[ 7 ]
	);

	THREE.Line.call( this, geometry, new THREE.LineBasicMaterial( { color: 0xffff00 } ), THREE.LinePieces );

	if ( object !== undefined ) {

		this.update( object );

	}

};

THREE.OldBoxHelper.prototype = Object.create( THREE.Line.prototype );

THREE.OldBoxHelper.prototype.update = function ( object ) {

	var geometry = object.geometry;

	if ( geometry.boundingBox === null ) {

		geometry.computeBoundingBox();

	}

	var min = geometry.boundingBox.min;
	var max = geometry.boundingBox.max;
	var vertices = this.vertices;

	vertices[ 0 ].set( max.x, max.y, max.z );
	vertices[ 1 ].set( min.x, max.y, max.z );
	vertices[ 2 ].set( min.x, min.y, max.z );
	vertices[ 3 ].set( max.x, min.y, max.z );
	vertices[ 4 ].set( max.x, max.y, min.z );
	vertices[ 5 ].set( min.x, max.y, min.z );
	vertices[ 6 ].set( min.x, min.y, min.z );
	vertices[ 7 ].set( max.x, min.y, min.z );

	this.geometry.computeBoundingSphere();
	this.geometry.verticesNeedUpdate = true;

	this.matrixAutoUpdate = false;
	this.matrixWorld = object.matrixWorld;

};

THREE.Detector = { //Object to detect if browser supports a usable webgl mode, doesn't matter if construct doesn't

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

/*THREE.DeepClone = function ( obj2clone , mat2use , flag , flagShared,matarr ) { // Special cloning function to make deep copies of geometry, its the only way to properly share geometry with particular type specific buffers for textures.
// cloning the geometry of large meshes and rebuilding buffers is slow :<
	var object
	var matref
	if(matarr) matarr.length = 0;
	
	//if ( recursive === undefined ) recursive = true;
	if(obj2clone.geometry){
		if( mat2use ){
		if(flag) object = new THREE.Mesh(obj2clone.geometry, mat2use)
		else 	object = new THREE.Mesh(obj2clone.geometry.clone(), mat2use);
		}
		else if( obj2clone.material){
			if(!flagShared){
			object = new THREE.Mesh(obj2clone.geometry, obj2clone.material.clone() )//new THREE.MeshBasicMaterial()); //
			matarr.push(object.material);
			//var str = "";
			//var key;
			//for (key in object){ str= str+key+", \n"; };
			//alert(obj2clone.material[0].map);
			}
			else{
			//matref = matarr.push(obj2clone.material); //push returns length
			object = new THREE.Mesh( obj2clone.geometry.clone(), obj2clone.material );
			//this.mat = object.material;
			matarr.push(object.material);
			//object.material.setRGB(0,0,0);
			};
		}else alert("Object file does not specify any material for some geometry, you cannot use an object material in this case, as it will create errors");
	}
	else object = new THREE.Object3D();
	
	object.name = obj2clone.name;

	object.up.copy( obj2clone.up );

	object.position.copy( obj2clone.position );
	object.quaternion.copy( obj2clone.quaternion );
	object.scale.copy( obj2clone.scale );

	object.renderDepth = obj2clone.renderDepth;

	object.rotationAutoUpdate = obj2clone.rotationAutoUpdate;

	object.matrix.copy( obj2clone.matrix );
	object.matrixWorld.copy( obj2clone.matrixWorld );

	object.matrixAutoUpdate = obj2clone.matrixAutoUpdate;
	object.matrixWorldNeedsUpdate = obj2clone.matrixWorldNeedsUpdate;

	object.visible = obj2clone.visible;

	object.castShadow = obj2clone.castShadow;
	object.receiveShadow = obj2clone.receiveShadow;

	object.frustumCulled = obj2clone.frustumCulled;

	object.userData = JSON.parse( JSON.stringify( obj2clone.userData ) );
	
	// i don't ever use this but becareful that this wont cause an POTENTIAL BUG
	

	var childclone
		for ( var i = 0; i < obj2clone.children.length; i ++ ) {

			var child = obj2clone.children[ i ];
			if(child.geometry && child.material){ // this is hopefully a mesh, make a deep copy
				if( mat2use ){
					//alert('deepclonin');
					if(flag){ 
						childclone = new THREE.Mesh(child.geometry, mat2use)
						//object.updateMatrix();
						//childclone.updateMatrix();
						object.add(childclone);
					}
					else{ 
						//var geom = new THREE.BufferGeometry()
					//geom.fromGeometry ( child.geometry )
						childclone = new THREE.Mesh(child.geometry.clone(),mat2use)
						//childclone.matrixAutoUpdate = false
						//object.updateMatrix();
						//childclone.updateMatrix();
						object.add(childclone);
					};
				}else{
					if(flag){ 
						if(!flagShared){
						matref = matarr.push(child.material.clone()); //push returns length
						childclone = new THREE.Mesh(child.geometry,matarr[matref-1]);
						}else{
						matref = matarr.push(child.material); //push returns length
						childclone = new THREE.Mesh(child.geometry,matarr[matref-1]);
						};
						object.add(childclone);
					}
					else{
						matref = matarr.push(child.material.clone()); //push returns length
						childclone = new THREE.Mesh(child.geometry.clone(), matarr[matref-1]);
						object.add(childclone);
					};
				};
			}
			else{
				object.add( child.clone() );
				
			}
		}

	//}

	return object;

};*/

THREE.DeepClone = function ( obj2clone , mat2use , flag4lightmap){ // Special cloning function to make deep copies of geometry, its the only way to properly share geometry with particular type specific buffers for textures.
// cloning the geometry of large meshes and rebuilding buffers is slow :<
	/*var object
	
	// obj2clone may be an object we need itself, so check if its a mesh and do the appropriate deep cloning, while overriding the materials with mat2use 
	
	if(obj2clone instanceof THREE.Mesh){

		object = new THREE.Mesh(obj2clone.geometry.clone(), mat2use);
	
	}else if(obj2clone instanceof THREE.SkinnedMesh){
	
		object = new THREE.SkinnedMesh(obj2clone.geometry.clone(), mat2use);
	
	}else if(obj2clone instanceof THREE.MorphAnimMesh){
	
		object = new THREE.MorphAnimMesh(obj2clone.geometry.clone(), mat2use);
	
	}else{

		object = new THREE.Object3D();
	
	};*/
	
	var object,geom,UVlen,UVi;
	
	// obj2clone may be an object we need itself, so check if its a mesh and do the appropriate deep cloning, while overriding the materials with mat2use 
	if(obj2clone.geometry){
	
		geom = obj2clone.geometry.clone()
		geom.morphTargets = obj2clone.geometry.morphTargets; // will this work? YES!
		geom.morphColors = obj2clone.geometry.morphColors;
		geom.morphNormals = obj2clone.geometry.morphNormals;
		// for skinning
		geom.bones = obj2clone.geometry.bones;
		geom.animations = obj2clone.geometry.animations;
		geom.animation = obj2clone.geometry.animation;
		geom.skinWeights =  obj2clone.geometry.skinWeights;
		geom.skinIndices =  obj2clone.geometry.skinIndices;
		//alert(geom.bones);
		
		if(flag4lightmap){
			geom.faceVertexUvs[ 1 ] = geom.faceVertexUvs[ 0 ]; //share uvs, can use lightmap for other stuff in this case;
		}else{
			for( UVi = 1, UVlen = obj2clone.geometry.faceVertexUvs.length ; UVi < UVlen ; UVi++){ 
			// default geometry clone method as of this comment for r69 doesn't clone secondary UV layers, so do this for indexes 1 to N
			
				geom.faceVertexUvs[ UVi ] = [];

				var uvs = obj2clone.geometry.faceVertexUvs[ UVi ];

				for ( var i = 0, il = uvs.length; i < il; i ++ ) {

					var uv = uvs[ i ], uvCopy = [];

					for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

						uvCopy.push( new THREE.Vector2( uv[ j ].x, uv[ j ].y ) );

					};

					geom.faceVertexUvs[ UVi ].push( uvCopy );

				};
			
			};
			
		};
		
		/*if(obj2clone instanceof THREE.Mesh){

			object = new THREE.Mesh(geom, mat2use );
			alert('test');
		
		}else if(obj2clone instanceof THREE.SkinnedMesh){
		
			object = new THREE.SkinnedMesh(geom, mat2use );
			alert('skinned DeepClone')
		
		}else if(obj2clone instanceof THREE.MorphAnimMesh){
		
			object = new THREE.MorphAnimMesh(geom, mat2use );
		
		};*/
		
		if(obj2clone instanceof THREE.SkinnedMesh){ // gotta be before mesh since it's also instanceof THREE.mesh, and will never be reached in old order.
		
			object = new THREE.SkinnedMesh(geom, mat2use );
			//alert('skinned DeepClone')
		
		}/*else if(obj2clone instanceof THREE.MorphAnimMesh){
		
			object = new THREE.MorphAnimMesh(geom, mat2use );
			alert('morph mesh');
		
		}*/else if(obj2clone instanceof THREE.Mesh){

			object = new THREE.Mesh(geom, mat2use );
			//alert('regular mesh');
		
		};
	
	}else{		
	
		object = new THREE.Object3D();
	
	};
	
	//copy general info about the object
	
	object.name = obj2clone.name;

	object.up.copy( obj2clone.up );

	object.position.copy( obj2clone.position );
	object.quaternion.copy( obj2clone.quaternion );
	object.scale.copy( obj2clone.scale );

	object.renderDepth = obj2clone.renderDepth;

	object.rotationAutoUpdate = obj2clone.rotationAutoUpdate;

	object.matrix.copy( obj2clone.matrix );
	object.matrixWorld.copy( obj2clone.matrixWorld );

	object.matrixAutoUpdate = obj2clone.matrixAutoUpdate;
	object.matrixWorldNeedsUpdate = obj2clone.matrixWorldNeedsUpdate;

	object.visible = obj2clone.visible;

	object.castShadow = obj2clone.castShadow;
	object.receiveShadow = obj2clone.receiveShadow;

	object.frustumCulled = obj2clone.frustumCulled;

	object.userData = JSON.parse( JSON.stringify( obj2clone.userData ) );
	
	// i don't ever use this but becareful that this wont cause an POTENTIAL BUG
	

	/*var childclone
	
	for ( var i = 0; i < obj2clone.children.length; i ++ ) {

		object.add( THREE.DeepClone(obj2clone.children[ i ],mat2use) );
		
	};*/

	return object;

};

THREE.DeepCloneModel = function ( obj2clone , flag4lightmap) { // Special cloning function to make deep copies of geometry, its the only way to properly share geometry with particular type specific buffers for textures.
// cloning the geometry of large meshes and rebuilding buffers is slow :<
	
	var object,geom,UVlen,UVi;
	
	// obj2clone may be an object we need itself, so check if its a mesh and do the appropriate deep cloning, while overriding the materials with mat2use 
	if(obj2clone.geometry){
	
		geom = obj2clone.geometry.clone();
		geom.morphTargets = obj2clone.geometry.morphTargets; // will this work? YES!
		geom.morphColors = obj2clone.geometry.morphColors;
		geom.morphNormals = obj2clone.geometry.morphNormals;
		// for skinning
		geom.bones = obj2clone.geometry.bones;
		geom.animations = obj2clone.geometry.animations;
		geom.animation = obj2clone.geometry.animation;
		geom.skinWeights =  obj2clone.geometry.skinWeights;
		geom.skinIndices =  obj2clone.geometry.skinIndices;
		
		
		if(flag4lightmap){
			geom.faceVertexUvs[ 1 ] = geom.faceVertexUvs[ 0 ]; //share uvs, can use lightmap for other stuff in this case;
		}else{
			for( UVi = 1, UVlen = obj2clone.geometry.faceVertexUvs.length ; UVi < UVlen ; UVi++){ 
			// default geometry clone method as of this comment for r69 doesn't clone secondary UV layers, so do this for indexes 1 to N
			
				geom.faceVertexUvs[ UVi ] = [];

				var uvs = obj2clone.geometry.faceVertexUvs[ UVi ];

				for ( var i = 0, il = uvs.length; i < il; i ++ ) {

					var uv = uvs[ i ], uvCopy = [];

					for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

						uvCopy.push( new THREE.Vector2( uv[ j ].x, uv[ j ].y ) );

					};

					geom.faceVertexUvs[ UVi ].push( uvCopy );

				};
			
			};
			
		};
	
		if(obj2clone instanceof THREE.SkinnedMesh){
		
			object = new THREE.SkinnedMesh(geom, obj2clone.material.clone() );
			
			//alert('skinned DeepCloneModel')
		
		}/*else if(obj2clone instanceof THREE.MorphAnimMesh){
		
			object = new THREE.MorphAnimMesh(geom, obj2clone.material.clone() );
		
		}*/else if(obj2clone instanceof THREE.Mesh){

			object = new THREE.Mesh(geom, obj2clone.material.clone() );
			
			//alert('test')
		
		};
	
	}else{		
	
	
		object = new THREE.Object3D();
		//object.material = obj2clone.material.clone(); // not sure if this is gonna do what i think but i have no models to test it with :<
	
	};
	
	//copy general info about the object
	
	object.name = obj2clone.name;

	object.up.copy( obj2clone.up );

	object.position.copy( obj2clone.position );
	object.quaternion.copy( obj2clone.quaternion );
	object.scale.copy( obj2clone.scale );

	object.renderDepth = obj2clone.renderDepth;

	object.rotationAutoUpdate = obj2clone.rotationAutoUpdate;

	object.matrix.copy( obj2clone.matrix );
	object.matrixWorld.copy( obj2clone.matrixWorld );

	object.matrixAutoUpdate = obj2clone.matrixAutoUpdate;
	object.matrixWorldNeedsUpdate = obj2clone.matrixWorldNeedsUpdate;

	object.visible = obj2clone.visible;

	object.castShadow = obj2clone.castShadow;
	object.receiveShadow = obj2clone.receiveShadow;

	object.frustumCulled = obj2clone.frustumCulled;

	object.userData = JSON.parse( JSON.stringify( obj2clone.userData ) );
	
	// i don't ever use this but becareful that this wont cause an POTENTIAL BUG
	
	// do i really need this? should unify .obj files into a meshfacematerial when i add objmtl loader support
	/*var childclone
	
	for ( var i = 0; i < obj2clone.children.length; i ++ ) {
		//alert("calling DeepCloneModel on children : "+obj2clone.children[ i ].name);
		object.add( THREE.DeepCloneModel(obj2clone.children[ i ]) ); // not sure about this, may be better to create a shared material clone
		
	};*/

	return object;

};

THREE.SharedGeomClone = function ( obj2clone , mat2use){ // after making a DeepClone, create clones of that for similar hashes that share geometry

	var object
	
	if(obj2clone instanceof THREE.SkinnedMesh){
		//alert('test2')
		object = new THREE.SkinnedMesh(obj2clone.geometry, mat2use);
	
	}/*else if(obj2clone instanceof THREE.MorphAnimMesh){
	
		object = new THREE.MorphAnimMesh(obj2clone.geometry, mat2use);
	
	}*/else if(obj2clone instanceof THREE.Mesh){
		//alert('test');
		object = new THREE.Mesh(obj2clone.geometry, mat2use);
	
	}else{

		object = new THREE.Object3D();
		object.material = mat2use; // (its not a mesh so it wont render, but this makes catching the reference easier if this is the top object in .obj import)
		
	};
	

	//alert("run")
	//copy general info about the object
	
	object.name = obj2clone.name;

	object.up.copy( obj2clone.up );

	object.position.copy( obj2clone.position );
	object.quaternion.copy( obj2clone.quaternion );
	object.scale.copy( obj2clone.scale );

	object.renderDepth = obj2clone.renderDepth;

	object.rotationAutoUpdate = obj2clone.rotationAutoUpdate;

	object.matrix.copy( obj2clone.matrix );
	object.matrixWorld.copy( obj2clone.matrixWorld );

	object.matrixAutoUpdate = obj2clone.matrixAutoUpdate;
	object.matrixWorldNeedsUpdate = obj2clone.matrixWorldNeedsUpdate;

	object.visible = obj2clone.visible;

	object.castShadow = obj2clone.castShadow;
	object.receiveShadow = obj2clone.receiveShadow;

	object.frustumCulled = obj2clone.frustumCulled;

	object.userData = JSON.parse( JSON.stringify( obj2clone.userData ) );
	
	// i don't ever use this but becareful that this wont cause an POTENTIAL BUG
	

	/*var childclone
	
	for ( var i = 0; i < obj2clone.children.length; i ++ ) {

		object.add( THREE.SharedGeomClone(obj2clone.children[ i ],mat2use) );
		
	};*/

	return object;

};

THREE.SharedGeomMaterialCloneModel = function ( obj2clone){ // after making a DeepCloneModel, create clones of that for similar hashes that share geometry

	var object
	
	if(obj2clone instanceof THREE.SkinnedMesh){
	
		object = new THREE.SkinnedMesh(obj2clone.geometry, obj2clone.material);
	
	}/*else if(obj2clone instanceof THREE.MorphAnimMesh){
	
		object = new THREE.MorphAnimMesh(obj2clone.geometry, obj2clone.material);
	
	}*/else if(obj2clone instanceof THREE.Mesh){

		object = new THREE.Mesh(obj2clone.geometry, obj2clone.material);
	
	}else{

		object = new THREE.Object3D();
	
	};
	
	//copy general info about the object
	
	object.name = obj2clone.name;

	object.up.copy( obj2clone.up );

	object.position.copy( obj2clone.position );
	object.quaternion.copy( obj2clone.quaternion );
	object.scale.copy( obj2clone.scale );

	object.renderDepth = obj2clone.renderDepth;

	object.rotationAutoUpdate = obj2clone.rotationAutoUpdate;

	object.matrix.copy( obj2clone.matrix );
	object.matrixWorld.copy( obj2clone.matrixWorld );

	object.matrixAutoUpdate = obj2clone.matrixAutoUpdate;
	object.matrixWorldNeedsUpdate = obj2clone.matrixWorldNeedsUpdate;

	object.visible = obj2clone.visible;

	object.castShadow = obj2clone.castShadow;
	object.receiveShadow = obj2clone.receiveShadow;

	object.frustumCulled = obj2clone.frustumCulled;

	object.userData = JSON.parse( JSON.stringify( obj2clone.userData ) );
	
	// i don't ever use this but becareful that this wont cause an POTENTIAL BUG
	

	/*var childclone
	
	for ( var i = 0; i < obj2clone.children.length; i ++ ) {

		object.add( THREE.SharedGeomMaterialCloneModel(obj2clone.children[ i ]) );
		
	};*/

	return object;

};

THREE.SharedGeomCloneModel = function ( obj2clone){ // after making a DeepCloneModel, create clones of that for similar hashes that share geometry

	var object
	
	if(obj2clone instanceof THREE.SkinnedMesh){
	
		object = new THREE.SkinnedMesh(obj2clone.geometry, obj2clone.material.clone());
	
	}/*else if(obj2clone instanceof THREE.MorphAnimMesh){
	
		object = new THREE.MorphAnimMesh(obj2clone.geometry, obj2clone.material.clone());
	
	}*/else if(obj2clone instanceof THREE.Mesh){

		object = new THREE.Mesh(obj2clone.geometry, obj2clone.material.clone());
	
	}else{

		object = new THREE.Object3D();
	
	};
	
	//copy general info about the object
	
	object.name = obj2clone.name;

	object.up.copy( obj2clone.up );

	object.position.copy( obj2clone.position );
	object.quaternion.copy( obj2clone.quaternion );
	object.scale.copy( obj2clone.scale );

	object.renderDepth = obj2clone.renderDepth;

	object.rotationAutoUpdate = obj2clone.rotationAutoUpdate;

	object.matrix.copy( obj2clone.matrix );
	object.matrixWorld.copy( obj2clone.matrixWorld );

	object.matrixAutoUpdate = obj2clone.matrixAutoUpdate;
	object.matrixWorldNeedsUpdate = obj2clone.matrixWorldNeedsUpdate;

	object.visible = obj2clone.visible;

	object.castShadow = obj2clone.castShadow;
	object.receiveShadow = obj2clone.receiveShadow;

	object.frustumCulled = obj2clone.frustumCulled;

	object.userData = JSON.parse( JSON.stringify( obj2clone.userData ) );
	
	// i don't ever use this but becareful that this wont cause an POTENTIAL BUG
	

	/*var childclone
	
	for ( var i = 0; i < obj2clone.children.length; i ++ ) {

		object.add( THREE.SharedGeomCloneModel(obj2clone.children[ i ]) );
		
	};*/

	return object;

};

// pre-calculate conversions
THREE.Deg2Rad = Math.PI/180;
THREE.Rad2Deg = 180/Math.PI;

//shim to add a reversed set/get hex into THREE.Color prototype to fix annoying fact that construct RGB(r,g,b) gives reversed hex for some odd reason, and make my life way easier replacing it;

THREE.Color.prototype.setHexR = function ( hex ) { // may be buggy as sin, don't know yet

		hex = Math.floor( hex );

		/*this.r*/ this.b = ( hex >> 16 & 255 ) / 255; // this used to set this.r
		/*this.g*/ this.g = ( hex >> 8 & 255 ) / 255; // this is unchanged
		/*this.b*/ this.r = ( hex & 255 ) / 255; // this used to set this.b

		return this;

};

THREE.Color.prototype.getHexR = function () {

		return ( this.b * 255 ) << 16 ^ ( this.g * 255 ) << 8 ^ ( this.r * 255 ) << 0;

};
	
	//lookuptable funcs for anims
/*THREE.setThisMap =  function(tex,_this){ _this.mat.map = tex; };
THREE.setThisSpecularMap =  function(tex,_this){ _this.mat.specularMap = tex; };
THREE.setThisLightMap =  function(tex,_this){ _this.mat.lightMap = tex; };
THREE.setThisEnvMap =  function(tex,_this){ _this.mat.envMap = tex; };
THREE.setThisNormalMap =  function(tex,_this){ _this.mat.normalMap = tex; };
THREE.setThisBumpMap =  function(tex,_this){ _this.mat.bumpMap = tex; };*/

THREE.setThisMap =  function(tex,_this){ 
	if(!_this.mat) return
	if(_this.mat.hasOwnProperty('map')) _this.mat.map = tex // for regular materials
	else if(_this.mat.uniforms && _this.mat.uniforms.map) _this.mat.uniforms.map.value = tex; // for shader materials
};
THREE.setThisSpecularMap =  function(tex,_this){ 
	if(!_this.mat) return
	if( _this.mat.hasOwnProperty('specularMap')) _this.mat.specularMap = tex // for regular materials
	else if(_this.mat.uniforms && _this.mat.uniforms.specularMap) _this.mat.uniforms.specularMap.value = tex; // for shader materials
};
THREE.setThisLightMap =  function(tex,_this){
	if(!_this.mat) return
	if( _this.mat.hasOwnProperty('lightMap')) _this.mat.lightMap = tex // for regular materials
	else if(_this.mat.uniforms && _this.mat.uniforms.lightMap) _this.mat.uniforms.lightMap.value = tex; // for shader materials
};
THREE.setThisEnvMap =  function(tex,_this){ 
	if(!_this.mat) return
	if(_this.mat.hasOwnProperty('envMap')) _this.mat.envMap = tex // for regular materials
	else if(_this.mat.uniforms && _this.mat.uniforms.envMap) _this.mat.uniforms.envMap.value = tex; // for shader materials
};
THREE.setThisNormalMap =  function(tex,_this){
	if(!_this.mat) return
	if( _this.mat.hasOwnProperty('normalMap')) _this.mat.normalMap = tex // for regular materials
	else if(_this.mat.uniforms && _this.mat.uniforms.normalMap) _this.mat.uniforms.normalMap.value = tex // for shader materials
};
THREE.setThisBumpMap =  function(tex,_this){
	if(!_this.mat) return
	if( _this.mat.hasOwnProperty('bumpMap')) _this.mat.bumpMap = tex // for regular materials
	else if(_this.mat.uniforms && _this.mat.uniforms.bumpMap) _this.mat.uniforms.bumpMap.value = tex // for shader materials
};

// for fast choosing of stuff

THREE.Q3D = {};
THREE.Q3D.DiffuseMap = 0;
THREE.Q3D.SpecularMap = 1;
THREE.Q3D.LightMap = 2;
THREE.Q3D.EnvironmentMap = 3;
THREE.Q3D.NormalMap = 4;
THREE.Q3D.BumpMap = 5;

THREE.Q3Da = []
THREE.Q3Da[0] = 'map';
THREE.Q3Da[1] = 'specularMap';
THREE.Q3Da[2] = 'lightMap';
THREE.Q3Da[3] = 'envMap';
THREE.Q3Da[4] = 'normalMap';
THREE.Q3Da[5] = 'bumpMap';

// projector deprecated in r69, took old projector code from r68

THREE.Projector = function () {

	var _object, _objectCount, _objectPool = [], _objectPoolLength = 0,
	_vertex, _vertexCount, _vertexPool = [], _vertexPoolLength = 0,
	_face, _faceCount, _facePool = [], _facePoolLength = 0,
	_line, _lineCount, _linePool = [], _linePoolLength = 0,
	_sprite, _spriteCount, _spritePool = [], _spritePoolLength = 0,

	_renderData = { objects: [], lights: [], elements: [] },

	_vA = new THREE.Vector3(),
	_vB = new THREE.Vector3(),
	_vC = new THREE.Vector3(),

	_vector3 = new THREE.Vector3(),
	_vector4 = new THREE.Vector4(),

	_clipBox = new THREE.Box3( new THREE.Vector3( - 1, - 1, - 1 ), new THREE.Vector3( 1, 1, 1 ) ),
	_boundingBox = new THREE.Box3(),
	_points3 = new Array( 3 ),
	_points4 = new Array( 4 ),

	_viewMatrix = new THREE.Matrix4(),
	_viewProjectionMatrix = new THREE.Matrix4(),

	_modelMatrix,
	_modelViewProjectionMatrix = new THREE.Matrix4(),

	_normalMatrix = new THREE.Matrix3(),

	_frustum = new THREE.Frustum(),

	_clippedVertex1PositionScreen = new THREE.Vector4(),
	_clippedVertex2PositionScreen = new THREE.Vector4();

	this.projectVector = function ( vector, camera ) {

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );

		return vector.applyProjection( _viewProjectionMatrix );

	};

	this.unprojectVector = function () {

		var projectionMatrixInverse = new THREE.Matrix4();

		return function ( vector, camera ) {

			projectionMatrixInverse.getInverse( camera.projectionMatrix );
			_viewProjectionMatrix.multiplyMatrices( camera.matrixWorld, projectionMatrixInverse );

			return vector.applyProjection( _viewProjectionMatrix );

		};

	}();

	this.pickingRay = function ( vector, camera ) {

		// set two vectors with opposing z values
		vector.z = - 1.0;
		var end = new THREE.Vector3( vector.x, vector.y, 1.0 );

		this.unprojectVector( vector, camera );
		this.unprojectVector( end, camera );

		// find direction from vector to end
		end.sub( vector ).normalize();

		return new THREE.Raycaster( vector, end );

	};

	var RenderList = function () {

		var normals = [];
		var uvs = [];

		var object = null;
		var material = null;

		var normalMatrix = new THREE.Matrix3();

		var setObject = function ( value ) {

			object = value;
			material = object.material;

			normalMatrix.getNormalMatrix( object.matrixWorld );

			normals.length = 0;
			uvs.length = 0;

		};

		var projectVertex = function ( vertex ) {

			var position = vertex.position;
			var positionWorld = vertex.positionWorld;
			var positionScreen = vertex.positionScreen;

			positionWorld.copy( position ).applyMatrix4( _modelMatrix );
			positionScreen.copy( positionWorld ).applyMatrix4( _viewProjectionMatrix );

			var invW = 1 / positionScreen.w;

			positionScreen.x *= invW;
			positionScreen.y *= invW;
			positionScreen.z *= invW;

			vertex.visible = positionScreen.x >= - 1 && positionScreen.x <= 1 &&
					 positionScreen.y >= - 1 && positionScreen.y <= 1 &&
					 positionScreen.z >= - 1 && positionScreen.z <= 1;

		};

		var pushVertex = function ( x, y, z ) {

			_vertex = getNextVertexInPool();
			_vertex.position.set( x, y, z );

			projectVertex( _vertex );

		};

		var pushNormal = function ( x, y, z ) {

			normals.push( x, y, z );

		};

		var pushUv = function ( x, y ) {

			uvs.push( x, y );

		};

		var checkTriangleVisibility = function ( v1, v2, v3 ) {

			if ( v1.visible === true || v2.visible === true || v3.visible === true ) return true;

			_points3[ 0 ] = v1.positionScreen;
			_points3[ 1 ] = v2.positionScreen;
			_points3[ 2 ] = v3.positionScreen;

			return _clipBox.isIntersectionBox( _boundingBox.setFromPoints( _points3 ) );

		};

		var checkBackfaceCulling = function ( v1, v2, v3 ) {

			return ( ( v3.positionScreen.x - v1.positionScreen.x ) *
				    ( v2.positionScreen.y - v1.positionScreen.y ) -
				    ( v3.positionScreen.y - v1.positionScreen.y ) *
				    ( v2.positionScreen.x - v1.positionScreen.x ) ) < 0;

		};

		var pushLine = function ( a, b ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];

			_line = getNextLineInPool();

			_line.id = object.id;
			_line.v1.copy( v1 );
			_line.v2.copy( v2 );
			_line.z = ( v1.positionScreen.z + v2.positionScreen.z ) / 2;

			_line.material = object.material;

			_renderData.elements.push( _line );

		};

		var pushTriangle = function ( a, b, c ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];
			var v3 = _vertexPool[ c ];

			if ( checkTriangleVisibility( v1, v2, v3 ) === false ) return;

			if ( material.side === THREE.DoubleSide || checkBackfaceCulling( v1, v2, v3 ) === true ) {

				_face = getNextFaceInPool();

				_face.id = object.id;
				_face.v1.copy( v1 );
				_face.v2.copy( v2 );
				_face.v3.copy( v3 );
				_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;

				for ( var i = 0; i < 3; i ++ ) {

					var offset = arguments[ i ] * 3;
					var normal = _face.vertexNormalsModel[ i ];

					normal.set( normals[ offset ], normals[ offset + 1 ], normals[ offset + 2 ] );
					normal.applyMatrix3( normalMatrix ).normalize();

					var offset2 = arguments[ i ] * 2;

					var uv = _face.uvs[ i ];
					uv.set( uvs[ offset2 ], uvs[ offset2 + 1 ] );

				}

				_face.vertexNormalsLength = 3;

				_face.material = object.material;

				_renderData.elements.push( _face );

			}

		};

		return {
			setObject: setObject,
			projectVertex: projectVertex,
			checkTriangleVisibility: checkTriangleVisibility,
			checkBackfaceCulling: checkBackfaceCulling,
			pushVertex: pushVertex,
			pushNormal: pushNormal,
			pushUv: pushUv,
			pushLine: pushLine,
			pushTriangle: pushTriangle
		}

	};

	var renderList = new RenderList();

	this.projectScene = function ( scene, camera, sortObjects, sortElements ) {

		_faceCount = 0;
		_lineCount = 0;
		_spriteCount = 0;

		_renderData.elements.length = 0;

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		_viewMatrix.copy( camera.matrixWorldInverse.getInverse( camera.matrixWorld ) );
		_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );

		_frustum.setFromMatrix( _viewProjectionMatrix );

		//

		_objectCount = 0;

		_renderData.objects.length = 0;
		_renderData.lights.length = 0;

		scene.traverseVisible( function ( object ) {

			if ( object instanceof THREE.Light ) {

				_renderData.lights.push( object );

			} else if ( object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite ) {

				if ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) {

					_object = getNextObjectInPool();
					_object.id = object.id;
					_object.object = object;

					if ( object.renderDepth !== null ) {

						_object.z = object.renderDepth;

					} else {

						_vector3.setFromMatrixPosition( object.matrixWorld );
						_vector3.applyProjection( _viewProjectionMatrix );
						_object.z = _vector3.z;

					}

					_renderData.objects.push( _object );

				}

			}

		} );

		if ( sortObjects === true ) {

			_renderData.objects.sort( painterSort );

		}

		//

		for ( var o = 0, ol = _renderData.objects.length; o < ol; o ++ ) {

			var object = _renderData.objects[ o ].object;
			var geometry = object.geometry;

			renderList.setObject( object );

			_modelMatrix = object.matrixWorld;

			_vertexCount = 0;

			if ( object instanceof THREE.Mesh ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;
					var offsets = geometry.offsets;

					if ( attributes.position === undefined ) continue;

					var positions = attributes.position.array;

					for ( var i = 0, l = positions.length; i < l; i += 3 ) {

						renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

					}

					if ( attributes.normal !== undefined ) {

						var normals = attributes.normal.array;

						for ( var i = 0, l = normals.length; i < l; i += 3 ) {

							renderList.pushNormal( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] );

						}

					}

					if ( attributes.uv !== undefined ) {

						var uvs = attributes.uv.array;

						for ( var i = 0, l = uvs.length; i < l; i += 2 ) {

							renderList.pushUv( uvs[ i ], uvs[ i + 1 ] );

						}

					}

					if ( attributes.index !== undefined ) {

						var indices = attributes.index.array;

						if ( offsets.length > 0 ) {

							for ( var o = 0; o < offsets.length; o ++ ) {

								var offset = offsets[ o ];
								var index = offset.index;

								for ( var i = offset.start, l = offset.start + offset.count; i < l; i += 3 ) {

									renderList.pushTriangle( indices[ i ] + index, indices[ i + 1 ] + index, indices[ i + 2 ] + index );

								}

							}

						} else {

							for ( var i = 0, l = indices.length; i < l; i += 3 ) {

								renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

							}

						}

					} else {

						for ( var i = 0, l = positions.length / 3; i < l; i += 3 ) {

							renderList.pushTriangle( i, i + 1, i + 2 );

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					var vertices = geometry.vertices;
					var faces = geometry.faces;
					var faceVertexUvs = geometry.faceVertexUvs[ 0 ];

					_normalMatrix.getNormalMatrix( _modelMatrix );

					var isFaceMaterial = object.material instanceof THREE.MeshFaceMaterial;
					var objectMaterials = isFaceMaterial === true ? object.material : null;

					for ( var v = 0, vl = vertices.length; v < vl; v ++ ) {

						var vertex = vertices[ v ];
						renderList.pushVertex( vertex.x, vertex.y, vertex.z );

					}

					for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

						var face = faces[ f ];

						var material = isFaceMaterial === true
							 ? objectMaterials.materials[ face.materialIndex ]
							 : object.material;

						if ( material === undefined ) continue;

						var side = material.side;

						var v1 = _vertexPool[ face.a ];
						var v2 = _vertexPool[ face.b ];
						var v3 = _vertexPool[ face.c ];

						if ( material.morphTargets === true ) {

							var morphTargets = geometry.morphTargets;
							var morphInfluences = object.morphTargetInfluences;

							var v1p = v1.position;
							var v2p = v2.position;
							var v3p = v3.position;

							_vA.set( 0, 0, 0 );
							_vB.set( 0, 0, 0 );
							_vC.set( 0, 0, 0 );

							for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

								var influence = morphInfluences[ t ];

								if ( influence === 0 ) continue;

								var targets = morphTargets[ t ].vertices;

								_vA.x += ( targets[ face.a ].x - v1p.x ) * influence;
								_vA.y += ( targets[ face.a ].y - v1p.y ) * influence;
								_vA.z += ( targets[ face.a ].z - v1p.z ) * influence;

								_vB.x += ( targets[ face.b ].x - v2p.x ) * influence;
								_vB.y += ( targets[ face.b ].y - v2p.y ) * influence;
								_vB.z += ( targets[ face.b ].z - v2p.z ) * influence;

								_vC.x += ( targets[ face.c ].x - v3p.x ) * influence;
								_vC.y += ( targets[ face.c ].y - v3p.y ) * influence;
								_vC.z += ( targets[ face.c ].z - v3p.z ) * influence;

							}

							v1.position.add( _vA );
							v2.position.add( _vB );
							v3.position.add( _vC );

							renderList.projectVertex( v1 );
							renderList.projectVertex( v2 );
							renderList.projectVertex( v3 );

						}

						if ( renderList.checkTriangleVisibility( v1, v2, v3 ) === false ) continue;

						var visible = renderList.checkBackfaceCulling( v1, v2, v3 );

						if ( side !== THREE.DoubleSide ) {
							if ( side === THREE.FrontSide && visible === false ) continue;
							if ( side === THREE.BackSide && visible === true ) continue;
						}

						_face = getNextFaceInPool();

						_face.id = object.id;
						_face.v1.copy( v1 );
						_face.v2.copy( v2 );
						_face.v3.copy( v3 );

						_face.normalModel.copy( face.normal );

						if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

							_face.normalModel.negate();

						}

						_face.normalModel.applyMatrix3( _normalMatrix ).normalize();

						var faceVertexNormals = face.vertexNormals;

						for ( var n = 0, nl = Math.min( faceVertexNormals.length, 3 ); n < nl; n ++ ) {

							var normalModel = _face.vertexNormalsModel[ n ];
							normalModel.copy( faceVertexNormals[ n ] );

							if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

								normalModel.negate();

							}

							normalModel.applyMatrix3( _normalMatrix ).normalize();

						}

						_face.vertexNormalsLength = faceVertexNormals.length;

						var vertexUvs = faceVertexUvs[ f ];

						if ( vertexUvs !== undefined ) {

							for ( var u = 0; u < 3; u ++ ) {

								_face.uvs[ u ].copy( vertexUvs[ u ] );

							}

						}

						_face.color = face.color;
						_face.material = material;

						_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;

						_renderData.elements.push( _face );

					}

				}

			} else if ( object instanceof THREE.Line ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;

					if ( attributes.position !== undefined ) {

						var positions = attributes.position.array;

						for ( var i = 0, l = positions.length; i < l; i += 3 ) {

							renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

						}

						if ( attributes.index !== undefined ) {

							var indices = attributes.index.array;

							for ( var i = 0, l = indices.length; i < l; i += 2 ) {

								renderList.pushLine( indices[ i ], indices[ i + 1 ] );

							}

						} else {

							var step = object.type === THREE.LinePieces ? 2 : 1;

							for ( var i = 0, l = ( positions.length / 3 ) - 1; i < l; i += step ) {

								renderList.pushLine( i, i + 1 );

							}

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					_modelViewProjectionMatrix.multiplyMatrices( _viewProjectionMatrix, _modelMatrix );

					var vertices = object.geometry.vertices;

					if ( vertices.length === 0 ) continue;

					v1 = getNextVertexInPool();
					v1.positionScreen.copy( vertices[ 0 ] ).applyMatrix4( _modelViewProjectionMatrix );

					// Handle LineStrip and LinePieces
					var step = object.type === THREE.LinePieces ? 2 : 1;

					for ( var v = 1, vl = vertices.length; v < vl; v ++ ) {

						v1 = getNextVertexInPool();
						v1.positionScreen.copy( vertices[ v ] ).applyMatrix4( _modelViewProjectionMatrix );

						if ( ( v + 1 ) % step > 0 ) continue;

						v2 = _vertexPool[ _vertexCount - 2 ];

						_clippedVertex1PositionScreen.copy( v1.positionScreen );
						_clippedVertex2PositionScreen.copy( v2.positionScreen );

						if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) === true ) {

							// Perform the perspective divide
							_clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
							_clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

							_line = getNextLineInPool();

							_line.id = object.id;
							_line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
							_line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

							_line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );

							_line.material = object.material;

							if ( object.material.vertexColors === THREE.VertexColors ) {

								_line.vertexColors[ 0 ].copy( object.geometry.colors[ v ] );
								_line.vertexColors[ 1 ].copy( object.geometry.colors[ v - 1 ] );

							}

							_renderData.elements.push( _line );

						}

					}

				}

			} else if ( object instanceof THREE.Sprite ) {

				_vector4.set( _modelMatrix.elements[ 12 ], _modelMatrix.elements[ 13 ], _modelMatrix.elements[ 14 ], 1 );
				_vector4.applyMatrix4( _viewProjectionMatrix );

				var invW = 1 / _vector4.w;

				_vector4.z *= invW;

				if ( _vector4.z >= - 1 && _vector4.z <= 1 ) {

					_sprite = getNextSpriteInPool();
					_sprite.id = object.id;
					_sprite.x = _vector4.x * invW;
					_sprite.y = _vector4.y * invW;
					_sprite.z = _vector4.z;
					_sprite.object = object;

					_sprite.rotation = object.rotation;

					_sprite.scale.x = object.scale.x * Math.abs( _sprite.x - ( _vector4.x + camera.projectionMatrix.elements[ 0 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 12 ] ) );
					_sprite.scale.y = object.scale.y * Math.abs( _sprite.y - ( _vector4.y + camera.projectionMatrix.elements[ 5 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 13 ] ) );

					_sprite.material = object.material;

					_renderData.elements.push( _sprite );

				}

			}

		}

		if ( sortElements === true ) _renderData.elements.sort( painterSort );

		return _renderData;

	};

	// Pools

	function getNextObjectInPool() {

		if ( _objectCount === _objectPoolLength ) {

			var object = new THREE.RenderableObject();
			_objectPool.push( object );
			_objectPoolLength ++;
			_objectCount ++;
			return object;

		}

		return _objectPool[ _objectCount ++ ];

	}

	function getNextVertexInPool() {

		if ( _vertexCount === _vertexPoolLength ) {

			var vertex = new THREE.RenderableVertex();
			_vertexPool.push( vertex );
			_vertexPoolLength ++;
			_vertexCount ++;
			return vertex;

		}

		return _vertexPool[ _vertexCount ++ ];

	}

	function getNextFaceInPool() {

		if ( _faceCount === _facePoolLength ) {

			var face = new THREE.RenderableFace();
			_facePool.push( face );
			_facePoolLength ++;
			_faceCount ++;
			return face;

		}

		return _facePool[ _faceCount ++ ];


	}

	function getNextLineInPool() {

		if ( _lineCount === _linePoolLength ) {

			var line = new THREE.RenderableLine();
			_linePool.push( line );
			_linePoolLength ++;
			_lineCount ++
			return line;

		}

		return _linePool[ _lineCount ++ ];

	}

	function getNextSpriteInPool() {

		if ( _spriteCount === _spritePoolLength ) {

			var sprite = new THREE.RenderableSprite();
			_spritePool.push( sprite );
			_spritePoolLength ++;
			_spriteCount ++
			return sprite;

		}

		return _spritePool[ _spriteCount ++ ];

	}

	//

	function painterSort( a, b ) {

		if ( a.z !== b.z ) {

			return b.z - a.z;

		} else if ( a.id !== b.id ) {

			return a.id - b.id;

		} else {

			return 0;

		}

	}

	function clipLine( s1, s2 ) {

		var alpha1 = 0, alpha2 = 1,

		// Calculate the boundary coordinate of each vertex for the near and far clip planes,
		// Z = -1 and Z = +1, respectively.
		bc1near =  s1.z + s1.w,
		bc2near =  s2.z + s2.w,
		bc1far =  - s1.z + s1.w,
		bc2far =  - s2.z + s2.w;

		if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

			// Both vertices lie entirely within all clip planes.
			return true;

		} else if ( ( bc1near < 0 && bc2near < 0 ) || ( bc1far < 0 && bc2far < 0 ) ) {

			// Both vertices lie entirely outside one of the clip planes.
			return false;

		} else {

			// The line segment spans at least one clip plane.

			if ( bc1near < 0 ) {

				// v1 lies outside the near plane, v2 inside
				alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

			} else if ( bc2near < 0 ) {

				// v2 lies outside the near plane, v1 inside
				alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

			}

			if ( bc1far < 0 ) {

				// v1 lies outside the far plane, v2 inside
				alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

			} else if ( bc2far < 0 ) {

				// v2 lies outside the far plane, v2 inside
				alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

			}

			if ( alpha2 < alpha1 ) {

				// The line segment spans two boundaries, but is outside both of them.
				// (This can't happen when we're only clipping against just near/far but good
				//  to leave the check here for future usage if other clip planes are added.)
				return false;

			} else {

				// Update the s1 and s2 vertices to match the clipped line segment.
				s1.lerp( s2, alpha1 );
				s2.lerp( s1, 1 - alpha2 );

				return true;

			}

		}

	}

};

////////////////////////////////////////////////////////////////////////

THREE.Raycaster.prototype.pickingRaySHIM = function( x,y, camera ) { //////////https://github.com/mrdoob/three.js/issues/5587 , newer versions after r-69 will likely have this so...

    // the camera is assumed _not_ to be a child of a transformed object

    if ( camera.inPerspectiveMode ) {

        this.ray.origin.copy( camera.position );

        this.ray.direction.set( x, y, 0.5 ).unproject( camera ).sub( camera.position ).normalize();

    } else if ( camera.inOrthographicMode ) {

        this.ray.origin.set( x, y, - 1 ).unproject( camera );

        this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );

    } else {

        console.error( 'ERROR: Raycaster.js encountered an unknown camera type.' );

    }

};

( function ( THREE ) {

	var descSort = function ( a, b ) {

		return a.distance - b.distance;

	};
	
	var intersectObject = function ( object, raycaster, intersects, recursive ) {

		object.raycast( raycaster, intersects );

		if ( recursive === true ) {

			var children = object.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				intersectObject( children[ i ], raycaster, intersects, true );

			}

		}

	};

THREE.Raycaster.prototype.intersectObjectsPASS = function ( objects, recursive , intersects ) {

			intersects.length = 0;

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				intersectObject( objects[ i ], this, intersects, recursive );

			}

			intersects.sort( descSort );

			return;

};

}( THREE ) );

///////////////////////////////////////////////////////////////////////////////////////////// for skeleton stuff
