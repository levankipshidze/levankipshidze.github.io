// Modified skinned mesh for use with Q3D
//alert(runtime)
THREE.SkinnedMesh = function ( geometry, material, useVertexTexture ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'SkinnedMesh';

	this.bindMode = "attached";
	//this.bindMode = "detached"
	this.bindMatrix = new THREE.Matrix4();
	this.bindMatrixInverse = new THREE.Matrix4();


	// init bones

	// TODO: remove bone creation as there is no reason (other than
	// convenience) for THREE.SkinnedMesh to do this.



};


THREE.SkinnedMesh.prototype = Object.create( THREE.Mesh.prototype );

THREE.SkinnedMesh.prototype.initC2Bones = function(instmesh,useVertexTexture) {
	
	this.boneInstances = [];
		
	//alert('initC2Bones')
	var bones = [];

	if ( this.geometry && this.geometry.bones !== undefined ) {

		var bone, gbone, p, q, s,boneinst;

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

			gbone = this.geometry.bones[ b ];

			p = gbone.pos;
			q = gbone.rotq;
			s = gbone.scl;
			
			THREE.Q3D.Runtime.BONECREATINGFLAG = true; // stupid flag to make sure bones are only created in a legal way by this function (assumes synchronous)
			
			boneinst = THREE.Q3D.Runtime.createInstanceFromInit(instmesh.boneType.default_instance, THREE.Q3D.Runtime.running_layout.layers[0], false, 0, 0, false);
			
			THREE.Q3D.Runtime.BONECREATINGFLAG = false;
			
			this.boneInstances.push(boneinst); // build an array of the instances for fast picking;
			boneinst.obj.skin = this;
			boneinst.skeleParent = instmesh;

			bone = boneinst.obj; //new THREE.Bone( this );
			bones.push( bone );
			
			bone.name = gbone.name;
			bone.position.set( p[ 0 ], p[ 1 ], p[ 2 ] );
			bone.quaternion.set( q[ 0 ], q[ 1 ], q[ 2 ], q[ 3 ] );

			if ( s !== undefined ) {

				bone.scale.set( s[ 0 ], s[ 1 ], s[ 2 ] );

			} else {

				bone.scale.set( 1, 1, 1 );

			}

		}

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

			gbone = this.geometry.bones[ b ];
			// top level parent is always going to be that of the mesh, so just set it here and forget about the order, also since this has a parent, needs the tag (this.hasQ3DObjParent = true)
			if ( gbone.parent !== - 1 ) {

				bones[ gbone.parent ].add( bones[ b ] );
				bones[b].userData.inst.toplevelparent =  instmesh.toplevelparent //bones[ gbone.parent ].userData.inst.toplevelparent;
				bones[b].userData.inst.hasQ3DObjParent = true
				
			} else {

				this.add( bones[ b ] );
				bones[b].userData.inst.toplevelparent  = instmesh.toplevelparent
				bones[b].userData.inst.hasQ3DObjParent = true

			}

		}
		
		if(instmesh.boneColTrans === 1){

			for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

				gbone = this.geometry.bones[ b ];
				var binst = bones[b].userData.inst
				// top level parent is always going to be that of the mesh, so just set it here and forget about the order, also since this has a parent, needs the tag (this.hasQ3DObjParent = true)
				if ( gbone.parent !== - 1 ) {
					
					var max = Math.max(Math.abs(gbone.pos[0]),Math.abs(gbone.pos[1]),Math.abs(gbone.pos[2]))
					var bdim = cr.clamp(max,Math.min(binst.width,binst.height,binst.properties[5]),Math.max(binst.width,binst.height,binst.properties[5]));
					bones[b].parent.userData.inst.col.position.set(gbone.pos[0],gbone.pos[1],gbone.pos[2])
					bones[b].parent.userData.inst.col.scale.set(cr.max(Math.abs(gbone.pos[0]),bdim),cr.max(Math.abs(gbone.pos[1]),bdim),cr.max(Math.abs(gbone.pos[2]), bdim))
					bones[b].parent.userData.inst.col.position.multiplyScalar( 0.5 )
					//bones[b].parent.userData.inst.colDebug.material.color.setHex(Math.random()*255*255*255)
					bones[b].parent.colupd = true;
					
				} else {

					bones[b].colupd = true;
					bones[b].userData.inst.col.position.set(0,0,0);
					bones[b].userData.inst.col.scale.set(binst.width,binst.height,binst.properties[5]); // I guess just use the info from the bone
			
				}

			}
		
			for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

				gbone = this.geometry.bones[ b ];
				// no idea if top level parent stuff is working properly atm, it seems like all my checking for world positioning stuff is too heavily reliant on making sure the objects are inst types, so ill need special hooks for model parents to work aswell :/
				if(!bones[b].colupd){
				 if(gbone.parent !== - 1){
					bones[b].userData.inst.col.position.set(0,0,0)
					bones[b].userData.inst.col.scale.copy(bones[b].parent.userData.inst.col.scale)
					//bones[b].userData.inst.colDebug.material.color.setHex(Math.random()*255*255*255)
					}else{
					bones[b].userData.inst.colDebug.visible = false;
					}
				}

			}
		
		};
		
	}

	this.normalizeSkinWeights();

	// fixes that stupid stretchy man bug, was cause by collision system turning off "matrix auto update flag", breaking the matrixUpdate from the positional updates, pretty obtuse bug
	for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++b ) {

		bones[ b ].updateMatrix();

	}
	
	this.updateMatrixWorld( true );
	

	
	
	//var skel
	//if(this.skeleton) var skel = this.skeleton.boneInverses
	this.bind( new THREE.Skeleton( bones, undefined, useVertexTexture ) );

	
};

THREE.SkinnedMesh.prototype.destroyC2Bones = function() {

	for ( var b = 0, bl = this.skeleton.bones.length; b < bl; b++ ) {
	
		THREE.Q3D.Runtime.DestroyInstance(this.skeleton.bones[b].userData.inst);
	
	};

};

THREE.SkinnedMesh.prototype.bind = function( skeleton, bindMatrix ) {

	this.skeleton = skeleton;

	if ( bindMatrix === undefined ) {

		this.updateMatrixWorld( true );

		bindMatrix = this.matrixWorld;

	}

	this.bindMatrix.copy( bindMatrix );
	this.bindMatrixInverse.getInverse( bindMatrix );

};

THREE.SkinnedMesh.prototype.pose = function () {

	this.skeleton.pose();

};

THREE.SkinnedMesh.prototype.normalizeSkinWeights = function () {

	if ( this.geometry instanceof THREE.Geometry ) {

		for ( var i = 0; i < this.geometry.skinIndices.length; i ++ ) {

			var sw = this.geometry.skinWeights[ i ];

			var scale = 1.0 / sw.lengthManhattan();

			if ( scale !== Infinity ) {

				sw.multiplyScalar( scale );

			} else {

				sw.set( 1 ); // this will be normalized by the shader anyway

			}

		}

	} else {

		// skinning weights assumed to be normalized for THREE.BufferGeometry

	}

};

THREE.SkinnedMesh.prototype.updateMatrixWorld = function( force ) {

	THREE.Mesh.prototype.updateMatrixWorld.call( this, true );

	if ( this.bindMode === "attached" ) {

		this.bindMatrixInverse.getInverse( this.matrixWorld );

	} else if ( this.bindMode === "detached" ) {

		this.bindMatrixInverse.getInverse( this.bindMatrix );

	} else {

		console.warn( 'THREE.SkinnedMesh unreckognized bindMode: ' + this.bindMode );

	}

};

THREE.SkinnedMesh.prototype.clone = function( object ) {

	if ( object === undefined ) {

		object = new THREE.SkinnedMesh( this.geometry, this.material, this.useVertexTexture );

	}

	THREE.Mesh.prototype.clone.call( this, object );

	return object;

};