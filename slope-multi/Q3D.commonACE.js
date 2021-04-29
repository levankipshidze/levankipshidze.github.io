// Scripts in this file are automatically appended to Q3D plugins that require common features. rudimentary way to control inheritance.
/**
* @author Quazi
*/
// Edittime scripts need to be copy pasted manually :(

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////					EDITTIME COMMON ACE								  //////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

/* // REMOVE ASTERIX TO ENABLE EASIER EDITING

//////////////////////////////////////////////////////////////////////////////////////////////////////////////// for commonACE obj stuff, use ACE ids starting from 1000's

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Conditions ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

AddCondition(1000, cf_none, "Is visible", "Appearance", "Is visible", "Check if visible or not", "ObjIsVisible");

AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Recursive", "Choose whether to loop through all childrens children or not", 0);
AddCondition(1001, cf_not_invertible, "Pick children", "Hierarchy", "Pick children (Recursive : <i>{0}</i>)", "Pick all the instances of valid Q3D-types that are parented to this object, either recursively or only those directly parented, overwrites current SOL, can be buggy if you're not careful", "ObjPickChildren");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Actions ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

AddNumberParam("X", "X position in parent space x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position in parent space y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position in parent space z-axis units.", initial_string = "0")
AddAction(1000, af_none, "Set position (parent space)", "Position", "Set position to <i>parent space</i> coordinates ({0},{1},{2}).", "Set the position of the object in parent space coordinates. (if the object is parented to the scene this is a better choice than world)", "ObjSetPosParent");

AddStringParam("Order", "Rotation order of the euler angles (written as any string ''XYZ'',''YXZ'' etc. which is a combination of X, Y and Z)", initial_string = "\"XYZ\"")
AddNumberParam("X", "X rotation in degrees.", initial_string = "0")
AddNumberParam("Y", "Y rotation in degrees.", initial_string = "0")
AddNumberParam("Z", "Z rotation in degrees.", initial_string = "0")
AddAction(1001, af_none, "Rotation from euler angles", "Rotation", "Set rotation in {0} order to Euler angles ({1},{2},{3}).", "Set the rotation of the object using specified euler angles.", "ObjSetRot");

AddNumberParam("X", "Parent space X position for object to look at in x-axis units.", initial_string = "0")
AddNumberParam("Y", "Parent space Y position for object to look at in y-axis units.", initial_string = "0")
AddNumberParam("Z", "Parent space Z position for object to look at in z-axis units.", initial_string = "0")
AddAction(1002, af_none, "Look at (parent space)", "Rotation", "Look at <i>parent space</i> position ({0},{1},{2}).", "Make the object +Z (blue axis line) look towards a point in parent space using up vector in parent space. (better performance than [look at (world space)] if you can get away with using it)", "ObjLookAtLocal");

AddNumberParam("X", "X component of vector to move along.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to move along.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to move along.", initial_string = "0")
AddNumberParam("Distance", "Amount to move along given vector in units.", initial_string = "0")
AddAction(1003, af_none, "Translate (local space)", "Position", "Translate along <i>local space</i> vector ({0},{1},{2}) by ({3}) units.", "Move the object along a given local space vector by a given amount", "ObjMoveAxisLocal");

AddNumberParam("X", "X component of vector to rotate around.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to rotate around.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to rotate around.", initial_string = "0")
AddNumberParam("Angle", "Amount to rotate around given vector in degrees.", initial_string = "0")
AddAction(1004, af_none, "Rotate around (local space)", "Rotation", "Rotate around <i>local space</i> vector ({0},{1},{2}) by ({3}) degrees.", "Rotate the object around a given local space vector by a given amount", "ObjRotAxisLocal");

AddNumberParam("X", "X component of up vector.", initial_string = "0")
AddNumberParam("Y", "Y component of up vector.", initial_string = "0")
AddNumberParam("Z", "Z component of up vector.", initial_string = "1")
AddAction(1005, af_none, "Set 'up' vector", "Rotation", "Set up vector to ({0},{1},{2}).", "Use to define what 'Look at' uses for it's up direction.", "ObjSetUpVec");

AddNumberParam("id", "unique 3D object id (see expressions)", initial_string = "self.idLast")
AddNumberParam("X", "X component of vector to move along.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to move along.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to move along.", initial_string = "0")
AddNumberParam("Distance", "Amount to move along given vector in units.", initial_string = "0")
AddAction(1006, af_deprecated, "Translate (world space)", " OBJECTS / POSITION", "<b>OBJECTS / POSITION</b> Move object {0} along <b>world</b> vector ({1},{2},{3}) by ({4}) units.", "Move the object along a given world space vector by a given amount", "ObjMoveAxis");

AddNumberParam("X", "X component of vector to rotate around.", initial_string = "1")
AddNumberParam("Y", "Y component of vector to rotate around.", initial_string = "0")
AddNumberParam("Z", "Z component of vector to rotate around.", initial_string = "0")
AddNumberParam("Angle", "Amount to rotate around given vector in degrees.", initial_string = "0")
AddAction(1007, af_none, "Rotate around (world space)", "Rotation", "Rotate around <i>world space</i> vector ({0},{1},{2}) by ({3}) degrees.", "Rotate the object around a given world space vector by a given amount", "ObjRotAxisWorld");

AddNumberParam("X", "X component of axis.", initial_string = "1")
AddNumberParam("Y", "Y component of axis.", initial_string = "0")
AddNumberParam("Z", "Z component of axis.", initial_string = "0")
AddNumberParam("Angle", "Angle to rotate around given axis in degrees.", initial_string = "0")
AddAction(1008, af_none, "Rotation from axis-angle", "Rotation", "Set rotation from axis ({0},{1},{2}) and angle ({3}).", "Set the rotation of the object in axis-angle representation.", "ObjSetRotAxisAngle");

AddNumberParam("X", "X scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddNumberParam("Y", "Y scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddNumberParam("Z", "Z scale (1 is unscaled, 2 is twice as big, etc.)", initial_string = "1")
AddAction(1009, af_none, "Set object scale (local)", "Size & Scale", "Set <i>local</i> object scale to ({0},{1},{2}).", "Sets the X,Y,Z scaling of the object.", "ObjSetScale");


////////////////////////////////////////////////////////////////////////////////////////////

AddComboParamOption("Visible");
AddComboParamOption("Invisible");
AddComboParam("Visibility", "Set whether the object is visbile or invisible.", "0");
AddAction(1010, af_none, "Set object visibility", "Appearance", "Make object <b>{0}</b>.", "Sets if this object is visible/invisible.", "ObjSetVisible");

AddComboParamOption("Don't cast shadows");
AddComboParamOption("Cast shadows");
AddComboParam("Shadows", "Set whether the object casts a shadow.", "1");
AddAction(1011, af_none, "Set object shadow casting", "Appearance", "<b>{0}</b> for object.", "Sets if this object casts a shadow (slow) default is no.", "ObjSetCastShadow");

AddComboParamOption("Don't receive shadows");
AddComboParamOption("Receive shadows");
AddComboParam("Shadows", "Set whether the object receives a shadow.", "1");
AddAction(1012, af_none, "Set object shadow receiving", "Appearance", "<b>{0}</b> for object.", "Sets if this object receives a shadow (slow) default is no.", "ObjSetReceiveShadow");

AddComboParamOption("Frustum culled");
AddComboParamOption("Not frustum culled");
AddComboParam("Culling", "Set whether the object is frustum culled.", "0");
AddAction(1013, af_none, "Set object frustum culling", "Appearance", "Object is <b>{0}</b>.", "Sets if this object is frustum culled when rendering, default is yes.", "ObjSetFrustumCulled");

AddComboParamOption("Auto update");
AddComboParamOption("Don't auto update");
AddComboParam("Update", "Set whether the object's matrix is auto updated every frame.", "0");
AddAction(1014, af_none, "Matrix update mode", "Matrix", "<b>{0}</b> matrix.", "sets if this objects matrix is auto updated, which causes unnecessary slowdown in static objects that wont change", "ObjSetMatrixAutoUpdate");

AddAction(1015, af_none, "Update object model matrix", "Matrix", "<b>Update model matrix</b> with current <i>rotation / scale / position</i>.", "Updates the model matrix with rotation / scale / position settings.", "ObjSetMatrixUpdate");

AddNumberParam("Row 0 (0,0)", "Value of matrix entry Xx", initial_string = "1")
AddNumberParam("(1,0)", "Value of matrix entry Xy", initial_string = "0")
AddNumberParam("(2,0)", "Value of matrix entry Xz", initial_string = "0")
AddNumberParam("(3,0)", "Value of matrix entry Xw", initial_string = "0")
AddNumberParam("Row 1 (0,1)", "Value of matrix entry Yx", initial_string = "0")
AddNumberParam("(1,1)", "Value of matrix entry Yy", initial_string = "1")
AddNumberParam("(2,1)", "Value of matrix entry Yz", initial_string = "0")
AddNumberParam("(3,1)", "Value of matrix entry Yw", initial_string = "0")
AddNumberParam("Row 2 (0,2)", "Value of matrix entry Zx", initial_string = "0")
AddNumberParam("(1,2)", "Value of matrix entry Zy", initial_string = "0")
AddNumberParam("(2,2)", "Value of matrix entry Zz", initial_string = "1")
AddNumberParam("(3,2)", "Value of matrix entry Zw", initial_string = "0")
AddNumberParam("Row 3 (0,3)", "Value of matrix entry Wx", initial_string = "0")
AddNumberParam("(1,3)", "Value of matrix entry Wy", initial_string = "0")
AddNumberParam("(2,3)", "Value of matrix entry Wz", initial_string = "0")
AddNumberParam("(3,3)", "Value of matrix entry Ww", initial_string = "1")
AddAction(1016, af_none, "Set model matrix", "Matrix", "Set model matrix to <b>[Rows]</b> : [{0},{1},{2},{3}] , [{4},{5},{6},{7}] , [{8},{9},{10},{11}] , [{12},{13},{14},{15}]", "Advanced feature to manually set up the model matrix", "ObjSetMatrix");

AddObjectParam("Object", "Select the object to become new parent.");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Transform", "Choose whether the object is scaled/rotated/positioned so that its new local transformation equals its old one in world space", 0);
AddAction(1017, af_none, "Change parent", "Hierarchy", "Change parent to {0}, <i>Transform: {1}</i>", "Changes the parent of the object to a picked one (must be a valid Q3D type), any transformations to the parent affect the child, the child has local position/rotation", "ObjChangeParent");

AddObjectParam("Object", "Select the object to become new child");
AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Transform", "Choose whether the object is scaled/rotated/positioned so that its new local transformation equals its old one in world space", 0);
AddAction(1018, af_none, "Add child", "Hierarchy", "Add child {0}, <i>Transform: {1}</i>", "Adds a picked objects of a selected type as children of this one(must be a valid Q3D type), any transformations of the object affect the child, the child has local position/rotation", "ObjAddChild");

AddComboParamOption("Yes");
AddComboParamOption("No");
AddComboParam("Transform", "Choose whether the object is scaled/rotated/positioned so that its new local transformation equals its old one in world space", 0);
AddAction(1019, af_none, "Change parent to scene", "Hierarchy", "Change parent to <b>current scene</b>, <i>Transform: {0}</i>", "Changes the parent of the object to the current scene", "ObjParentScene");

AddComboParamOption("On (filled)");
AddComboParamOption("On (wire)");
AddComboParamOption("Off");
AddComboParam("Debug", "Choose whether or not to show the Collision Grid Debug (will only appear if you have conditions which use it)", 2);
AddNumberParam("Cell x size", "Integer value representing the X size the collision grid cells", initial_string = "1000");
AddNumberParam("Cell y size", "Integer value representing the Y size the collision grid cells", initial_string = "1000");
AddNumberParam("Cell z size", "Integer value representing the Z size the collision grid cells", initial_string = "1000");
AddAction(1020, af_deprecated, "Coll. grid settings", "Collisions", "Set collision grid dimensions to <i>({1},{2},{3})</i> and turn debug <b>{0}</b>", "Make changes to the collision grid used to accelerate collision queries for this object type", "CollGridSettings");

AddNumberParam("X", "World space X position for object to look at in x-axis units.", initial_string = "0")
AddNumberParam("Y", "World space Y position for object to look at in y-axis units.", initial_string = "0")
AddNumberParam("Z", "World space Z position for object to look at in z-axis units.", initial_string = "0")
AddAction(1021, af_none, "Look at (world space)", "Rotation", "Look towards <i>world space</i> position ({0},{1},{2}).", "Make the object +Z (blue axis line) look towards a point in world space using up vector in world space.", "ObjLookAtWorld");

AddNumberParam("X", "X position in world space x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position in world space y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position in world space z-axis units.", initial_string = "0")
AddAction(1022, af_none, "Set position (world space)", "Position", "Set position to <i>world space</i> coordinates ({0},{1},{2}).", "Set the position of the object in world space coordinates.(the calculations done to transform the position to world space are intensive, use only if necessary)", "ObjSetPosWorld");

AddNumberParam("X", "X position in local space x-axis units.", initial_string = "0")
AddNumberParam("Y", "Y position in local space y-axis units.", initial_string = "0")
AddNumberParam("Z", "Z position in local space z-axis units.", initial_string = "0")
AddAction(1023, af_none, "Set position (local space)", "Position", "Set position to <i>local space</i> coordinates ({0},{1},{2}).", "Set the position of the object in local space coordinates.(the calculations done to transform the position to local space are intensive, use only if necessary)", "ObjSetPosLocal");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Expressions ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

AddExpression(1000, ef_return_number, "X position", "Position", "x", "Return the parent space x positon of the object (fast)");
AddExpression(1001, ef_return_number, "Y position", "Position", "y", "Return the parent space y positon of the object (fast)");
AddExpression(1002, ef_return_number, "Z position", "Position", "z", "Return the parent space z positon of the object (fast)");

AddExpression(1003, ef_return_number, "World x position", "Position", "xw", "Return the world space x positon of the object (slow)");
AddExpression(1004, ef_return_number, "World y position", "Position", "yw", "Return the world space y positon of the object (slow)");
AddExpression(1005, ef_return_number, "World z position", "Position", "zw", "Return the world space z positon of the object (slow)");

AddExpression(1006, ef_return_number, "Euler x rotation", "Rotation", "Rx", "Return the x component of rotation using euler angles");
AddExpression(1007, ef_return_number, "Euler y rotation", "Rotation", "Ry", "Return the y component of rotation using euler angles");
AddExpression(1008, ef_return_number, "Euler z rotation", "Rotation", "Rz", "Return the z component of rotation using euler angles");

AddExpression(1009, ef_return_string, "Euler rotation order", "Rotation", "Ro", "Return the euler angles rotation order");

AddExpression(1010, ef_return_number, "X scale", "Scale", "Sx", "Return the local x scale of the object");
AddExpression(1011, ef_return_number, "Y scale", "Scale", "Sy", "Return the local y scale of the object");
AddExpression(1012, ef_return_number, "Z scale", "Scale", "Sz", "Return the local z scale of the object");

AddExpression(1013, ef_return_number, "Normalized tangent vector x", "Pointing", "nTx", "Return the x component of the normalized tangent (local z axis) in world space");
AddExpression(1014, ef_return_number, "Normalized tangent vector y", "Pointing", "nTy", "Return the y component of the normalized tangent (local z axis) in world space");
AddExpression(1015, ef_return_number, "Normalized tangent vector z", "Pointing", "nTz", "Return the z component of the normalized tangent (local z axis) in world space");

AddExpression(1016, ef_return_number, "Normalized normal vector x", "Pointing", "nNx", "Return the x component of the normalized normal (local y axis) in world space");
AddExpression(1017, ef_return_number, "Normalized normal vector y", "Pointing", "nNy", "Return the y component of the normalized normal (local y axis) in world space");
AddExpression(1018, ef_return_number, "Normalized normal vector z", "Pointing", "nNz", "Return the z component of the normalized normal (local y axis) in world space");

AddExpression(1019, ef_return_number, "Normalized binormal vector x", "Pointing", "nBx", "Return the x component of the normalized binormal (local x axis) in world space");
AddExpression(1020, ef_return_number, "Normalized binormal vector y", "Pointing", "nBy", "Return the y component of the normalized binormal (local x axis) in world space");
AddExpression(1021, ef_return_number, "Normalized binormal vector z", "Pointing", "nBz", "Return the z component of the normalized binormal (local x axis) in world space");

AddExpression(1022, ef_return_number, "Tangent vector length", 	"Pointing", "Td", "Return the length of the tangent (local z axis) in world space");
AddExpression(1023, ef_return_number, "Normal vector length", 	"Pointing", "Nd", "Return the length of the normal (local y axis) in world space");
AddExpression(1024, ef_return_number, "Binormal vector length",  "Pointing", "Bd", "Return the length of the binormal (local x axis) in world space");

AddExpression(1025, ef_return_number, "'Up' vector x", "Rotation", "Ux", "Return the parent space x component of the up vector used for lookAt");
AddExpression(1026, ef_return_number, "'Up' vector y", "Rotation", "Uy", "Return the parent space y component of the up vector used for lookAt");
AddExpression(1027, ef_return_number, "'Up' vector z", "Rotation", "Uz", "Return the parent space z component of the up vector used for lookAt");

AddExpression(1028, ef_return_number, "'Up' vector world x", "Rotation", "Uxw", "Return the world space x component of the up vector used for lookAt");
AddExpression(1029, ef_return_number, "'Up' vector world y", "Rotation", "Uyw", "Return the world space y component of the up vector used for lookAt");
AddExpression(1030, ef_return_number, "'Up' vector world z", "Rotation", "Uzw", "Return the world space z component of the up vector used for lookAt");

AddExpression(1031, ef_return_number, "Parent UID", "Hierarchy", "Puid", "Return the uid of this objects direct parent (returns -1 for parent-less objects)");

AddExpression(1032, ef_return_number, "Top level parent UID", "Hierarchy", "TOPuid", "Return the uid of this objects top parent before the scene (returns -1 for parent-less objects)");

AddExpression(1033, ef_return_string, "Parent scene name", "Hierarchy", "scene", "Return the name of the scene this object is in");

AddNumberParam("index from 0 to 15");
AddExpression(1034, ef_return_number, "Model matrix element", "Matrix", "mM", "Return the value of an entry in the model matrix (a value from 0 - 15, column-major, see three.js matrix.elements)");

AddNumberParam("index from 0 to 15");
AddExpression(1035, ef_return_number, "World matrix element", "Matrix", "mW", "Return the value of an entry in the world matrix (a value from 0 - 15, column-major, see three.js matrix.elements)");

*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////					RUNTIME COMMON ACE								  //////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

THREE.TSH.commonACEappend = function(Cnds,Acts,Exps,instanceProto,typeProto,pluginProto){ // hacky, will this work?

//alert("appending ACE");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Function extenders /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// use this if the common features require particular behaviour within the onCreate, onDestroy, tick or tick2 etc. functions without completely overwriting other functionality the plugin needs.
// not sure if using these is a good idea, or if it'll make stuff slower than necessary;

   /* var old_function = instanceProto.set_bbox_changed;

    // Create a new function with the same name as the function we're extending.
    // This overrides the existing one, so that all calls to that function call this
    // new one instead
    instanceProto.set_bbox_changed = function() 
	{

        // Now, inside our extended function, we have the opportunity to take
        // actions before calling the original:
		alert("first call");

        // Call the original function, and pass the arguments to it, storing the return
        // value in a new variable
        //var result = old_adder.apply(this, arguments);
		old_function.call(this); // on create has no arguments, so call can be used here.
        
		// Additional work can be done after the original function has run as well:
		//alert("second call");

        // Return the result of the original function, or return something different
        // thanks to further processing that you may have done, to the original
        // caller of the base function.
        //return result;
    }*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// pluginProto functions //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// typeProto functions /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// instanceProto functions //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	instanceProto.set_bbox3D_changed  = THREE.TSH.set_bbox3D_changed;
	
	instanceProto.fastWorldUpdate = THREE.TSH.fastWorldUpdate;

	instanceProto.updateTNB = function ()   
	{
		if(!this.TNB.needsUpdate) return;
		
			this.TNB.needsUpdate = false;
			this.fastWorldUpdate();
			var inv, e = this.obj.matrixWorld.elements;
			
			this.TNB.Td = Math.sqrt(e[8]*e[8] + e[9]*e[9] + e[10]*e[10]); // local z
			this.TNB.Nd = Math.sqrt(e[4]*e[4] + e[5]*e[5] + e[6]*e[6]); // local y
			this.TNB.Bd = Math.sqrt(e[0]*e[0] + e[1]*e[1] + e[2]*e[2]); // local x	

			inv = 1/this.TNB.Td
			this.TNB.T.set(e[8]*inv,e[9]*inv,e[10]*inv);
			inv = 1/this.TNB.Nd
			this.TNB.N.set(e[4]*inv,e[5]*inv,e[6]*inv);
			inv = 1/this.TNB.Bd
			this.TNB.B.set(e[0]*inv,e[1]*inv,e[2]*inv);
	
	};

	instanceProto.updateUw = function ()   
	{
		if(!this.Uw.needsUpdate) return;
		
			this.Uw.needsUpdate = false;
			this.fastWorldUpdate();
			THREE.TSH.mtx0.copy(this.obj.parent.matrixWorld)
			THREE.TSH.mtx0.elements[12] = 0;
			THREE.TSH.mtx0.elements[13] = 0;
			THREE.TSH.mtx0.elements[14] = 0;
			
			this.Uw.up.copy(this.obj.up);
			this.Uw.up.applyMatrix4(THREE.TSH.mtx0);
	
	};
	
	instanceProto.setupObj = function (SFLAG,BFLAG)   // call at some point in onCreate , preferrably near the beginning to ensure stuff for actions/conditions exists;
	{
		this.hasQ3DObjParent = false;
		
		if(this.recycled){

			this.TNB.needsUpdate = true;
			this.Uw.needsUpdate = true;

		}else{

			this.Q3Dobject = true; // flag for destroy-instance modification in master to work on hierarchies
			//for special handling of Q3Dsprite with behaviour code, must be false;
			this.SFLAG = SFLAG;
			// remember the last scale this object was at;
			this.lastScale = new THREE.Vector3(0,0,0);
			
			this.TNB = {}
			
			this.TNB.needsUpdate = true;
			this.TNB.T = new THREE.Vector3(0,0,0);
			this.TNB.N = new THREE.Vector3(0,0,0);
			this.TNB.B = new THREE.Vector3(0,0,0);
			this.TNB.Td = 0;
			this.TNB.Nd = 0;
			this.TNB.Bd = 0;
			
			this.Uw = {};
			this.Uw.up = new THREE.Vector3(0,0,0);
			this.Uw.needsUpdate = true;
			
			if(BFLAG){
				this.obj = new THREE.Bone(); // special handling for bone type objects
			}else{
				this.obj = new THREE.Object3D();
			};
			
			this.obj.userData.inst = this;
			//this.obj.TESTINST = this;
			
			this.col = new THREE.Object3D();
		
		};
		
		this.scene = this.runtime.Q3D.scene;
		this.autoUpdateFlag = true;
		this.toplevelparent = this.obj;
		this.traversingResetFlag = false;
	
	 // IS THIS STILL NEEDED var old_function = this.set_bbox_changed;

    // Create a new function with the same name as the function we're extending.
    // This overrides the existing one, so that all calls to that function call this
    // new one instead
		
		if(SFLAG){
			this.set_bbox_changed = this.set_bbox_changed_MODIFIED;
			this.update_bbox = this.update_bbox_MODIFIED;
		}else{
			this.set_bbox_changed = this.set_bbox_changed_MODIFIED_3DSPRITE;
		};
	
	};
// hooks to make behaviours work properly
	instanceProto.set_bbox_changed_MODIFIED_3DSPRITE = function()
	{	
		/*this.BOLx = this.obj.position.x;
		this.BOLy = this.obj.position.y;
		this.BOLz = this.obj.position.z;
		this.BOLwidth = this.obj.scale.x;
		this.BOLheight = this.obj.scale.y;
		this.BOLangle = this.obj.rotation.z;*/
		
		this.set_bbox3D_changed(true);
		
		cr.set_bbox_changed.call(this); // maintain compatibility with behaviours?
		this.obj.position.set(this.x,this.y,this.obj.position.z);
		// scale is only affected by other stuff in this case
		//this.lastScale.copy(this.obj.scale);
		//this.obj.scale.set(this.width,this.height,this.obj.scale.z);
		//this.scaleChanged = true;
		this.obj.rotation.set(this.obj.rotation.x,this.obj.rotation.y,this.angle);
		
		/*this.x = this.obj.position.x;
		this.y = this.obj.position.y;
		this.z = this.obj.position.z;
		this.width = this.obj.scale.x;
		this.height = this.obj.scale.y;
		this.angle = this.obj.rotation.z;*/
	
	};	
	
	instanceProto.set_bbox_changed_MODIFIED = function()
	{	
		/*this.BOLx = this.obj.position.x;
		this.BOLy = this.obj.position.y;
		this.BOLz = this.obj.position.z;
		this.BOLwidth = this.obj.scale.x;
		this.BOLheight = this.obj.scale.y;
		this.BOLangle = this.obj.rotation.z;*/
		
		this.set_bbox3D_changed(true);
		
		cr.set_bbox_changed.call(this); // maintain compatibility with behaviours?
		this.obj.position.set(this.x,this.y,this.obj.position.z);
		this.lastScale.copy(this.obj.scale);
		this.obj.scale.set(this.width,this.height,this.obj.scale.z);
		this.scaleChanged = true;
		this.obj.rotation.set(this.obj.rotation.x,this.obj.rotation.y,this.angle);
		
		/*this.x = this.obj.position.x;
		this.y = this.obj.position.y;
		this.z = this.obj.position.z;
		this.width = this.obj.scale.x;
		this.height = this.obj.scale.y;
		this.angle = this.obj.rotation.z;*/
	
	};	
	
	instanceProto.update_bbox_MODIFIED = function()
	{		
		if(this.update_bbox3D) this.update_bbox3D(); // support objects that don't use collider;
		cr.update_bbox.call(this);
	};
	
	instanceProto.recursiveWipeSol = function()
	{		
		for(var i = this.obj.children.length-1 ; i > -1 ; i--){
			if(this.obj.children[i].userData.inst){
				var sol = this.obj.children[i].userData.inst.type.getCurrentSol();
				sol.select_all = false
				sol.instances.length = 0;
				this.obj.children[i].userData.inst.recursiveWipeSol();
			};
		};
	};
	
	instanceProto.recursivePickSol = function()
	{
		for(var i = this.obj.children.length-1 ; i > -1 ; i--){
			if(this.obj.children[i].userData.inst){
				var sol = this.obj.children[i].userData.inst.type.getCurrentSol();
				sol.instances.push(this.obj.children[i].userData.inst);
				this.obj.children[i].userData.inst.recursivePickSol();
			};
		};
	};
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Conditions ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Cnds.prototype.ObjIsVisible = function ()
	{
		return this.obj.visible;
	};	
	
	Cnds.prototype.ObjPickChildren = function (recursive)
	{
		var sol,i;
		var this_sol = this.type.getCurrentSol(); // can't overwrite original selected object list for this type
		this_sol.select_all = false
		this_sol.instances.length = 0;
		
		for( i = this.obj.children.length-1 ; i > -1 ; i--){
			if(this.obj.children[i].userData.inst){
			var sol = this.obj.children[i].userData.inst.type.getCurrentSol();
				if(sol !== this_sol){ // can't overwrite original selected object list for this type, or you'll lose what's calling this condition;
					sol.select_all = false
					sol.instances.length = 0;
					if(recursive === 0) this.obj.children[i].userData.inst.recursiveWipeSol();
				};
			};
		};
		
		/*for( i = this.runtime.Q3D.Q3DTypesList.length-1 ; i > -1 ; i--){
			sol = this.runtime.Q3D.Q3DTypesList[i].getCurrentSol();
			sol.select_all = false;
			sol.instances.length = 0;		
		}*/
		//alert(this.obj.children.length);
		
		for( i = this.obj.children.length-1 ; i > -1 ; i--){
			if(this.obj.children[i].userData.inst){
				sol = this.obj.children[i].userData.inst.type.getCurrentSol();
					sol.instances.push(this.obj.children[i].userData.inst);
							//alert(this.obj.children[i].userData.inst);
					if(recursive === 0) this.obj.children[i].userData.inst.recursivePickSol();
			};
		};
		
		this_sol.instances.push(this);
		//alert(this);
		
		return true;
	};
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Actions ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Acts.prototype.ObjSetPosLocal = function (xpos,ypos,zpos)
	{
	
		this.fastWorldUpdate();
		var e = this.obj.matrix.elements
		THREE.TSH.vec0.set(xpos*e[0]+ypos*e[4]+zpos*e[8],xpos*e[1]+ypos*e[5]+zpos*e[9],xpos*e[2]+ypos*e[6]+zpos*e[10]);
		this.obj.position.add(THREE.TSH.vec0);

		this.set_bbox3D_changed();

	};

	Acts.prototype.ObjSetPosParent = function (xpos,ypos,zpos)
	{

		this.obj.position.set(xpos,ypos,zpos)

		this.set_bbox3D_changed();

	};
	
	Acts.prototype.ObjSetPosWorld = function (xpos,ypos,zpos)
	{
	
		if(this.hasQ3DObjParent){
			this.fastWorldUpdate();
			var m1 = THREE.TSH.mtx0;
			m1.getInverse(this.obj.parent.matrixWorld);
			THREE.TSH.vec0.set(xpos,ypos,zpos);
			THREE.TSH.vec0.applyMatrix4(m1);
		}
		else{
			THREE.TSH.vec0.set(xpos,ypos,zpos)
		};
		this.obj.position.copy(THREE.TSH.vec0)
		
		this.set_bbox3D_changed();

	};
	
	Acts.prototype.ObjSetRot = function (order,xrot,yrot,zrot)
	{
	
		this.obj.rotation.order= order;

		this.obj.rotation.set(xrot*(THREE.Deg2Rad),yrot*(THREE.Deg2Rad),zrot*(THREE.Deg2Rad))
		
		this.set_bbox3D_changed();

	};
	
	Acts.prototype.ObjLookAtLocal = function (xpos,ypos,zpos)
	{
	
		THREE.TSH.vec0.set(xpos,ypos,zpos);
		
		this.obj.lookAt( THREE.TSH.vec0 );

		this.set_bbox3D_changed();
		//this.obj.rotation.setFromQuaternion(this.obj.quaternion);
	};
	
	Acts.prototype.ObjLookAtWorld = function (xpos,ypos,zpos)
	{

		var m2 = THREE.TSH.mtx1;

		//optimizations could go a long way in speeding this up.
		if(this.hasQ3DObjParent){
			
			this.fastWorldUpdate();
			
			var m1 = THREE.TSH.mtx0;
			
			var e = this.obj.parent.matrixWorld.elements

			m2.copy(this.obj.parent.matrixWorld);
			
			var e2 = m2.elements;
			e2[12]=0;
			e2[13]=0;
			e2[14]=0;
			m1.getInverse(m2);
			
			//this.obj.parent.userData.inst.m3inverse();
			
			THREE.TSH.vec0.set(xpos,ypos,zpos);
			THREE.TSH.vec0.applyMatrix4(m1);
			THREE.TSH.vec1.copy(this.obj.up);
			THREE.TSH.vec1.applyMatrix4(m1);
			THREE.TSH.vec2.set(this.obj.matrixWorld.elements[12],this.obj.matrixWorld.elements[13],this.obj.matrixWorld.elements[14]);
			THREE.TSH.vec2.applyMatrix4(m1);
			
			m2.lookAt( THREE.TSH.vec0 , THREE.TSH.vec2, THREE.TSH.vec1 );
		
		}else{ // incase users use this badly on an object parented to scene, speed it up, IF is cheaper than a huge mistake.
			
			THREE.TSH.vec0.set(xpos,ypos,zpos);
			m2.lookAt( THREE.TSH.vec0 , this.obj.position, this.obj.up );
		
		};

		this.obj.quaternion.setFromRotationMatrix( m2 );
		//this.obj.rotation.setFromRotationMatrix( m2 );
	
		this.set_bbox3D_changed();

	
	};
	
	Acts.prototype.ObjMoveAxisLocal = function (vecx,vecy,vecz,amount)
	{
	
		THREE.TSH.vec0.set(vecx,vecy,vecz);

		THREE.TSH.vec0.normalize();
		this.obj.translateOnAxis(THREE.TSH.vec0, amount);
		
		this.set_bbox3D_changed();
	
	};
	
	Acts.prototype.ObjRotAxisLocal = function (vecx,vecy,vecz,amount)
	{
		// ohhhhhhhhhhhhhhhhhhh please come to the principles office

		THREE.TSH.vec0.set(vecx,vecy,vecz);
		THREE.TSH.vec0.normalize();
		
		this.obj.rotateOnAxis(THREE.TSH.vec0, amount*(THREE.Deg2Rad));
		
		this.set_bbox3D_changed();
	};

	Acts.prototype.ObjSetUpVec = function (vecx,vecy,vecz)
	{
	
		THREE.TSH.vec0.set(vecx,vecy,vecz);
		THREE.TSH.vec0.normalize();
		
		this.obj.up.copy(THREE.TSH.vec0);
		
		this.Uw.needsUpdate = true;
	
	};
	
	Acts.prototype.ObjRotAxisWorld = function (vecx,vecy,vecz,amount)
	{
		// optimizable optimize performance

		this.fastWorldUpdate();
		
		THREE.TSH.vec0.set(vecx,vecy,vecz);

		var m1 = THREE.TSH.mtx0;
		var m2 = THREE.TSH.mtx1;
		m2.copy(this.obj.matrixWorld);
		m2.elements[12]=0;
		m2.elements[13]=0;
		m2.elements[14]=0;
		m1.getInverse(m2);

		THREE.TSH.vec0.applyMatrix4(m1);

		THREE.TSH.vec0.normalize();
		this.obj.rotateOnAxis(THREE.TSH.vec0, amount*(THREE.Deg2Rad));

		this.set_bbox3D_changed();
	
	};
		
	Acts.prototype.ObjSetRotAxisAngle = function (xax,yax,zax,angle)
	{

		THREE.TSH.vec0.set(xax,yax,zax);
		THREE.TSH.vec0.normalize();
		this.obj.setRotationFromAxisAngle(THREE.TSH.vec0,angle*(THREE.Deg2Rad));

		this.set_bbox3D_changed();
	
	};
	
	Acts.prototype.ObjSetScale = function (x,y,z)
	{
		this.lastScale.copy(this.obj.scale);
		this.obj.scale.set(x,y,z);
		this.scaleChanged = true;

		this.set_bbox3D_changed();
	
	};
	
	Acts.prototype.ObjSetVisible = function (vis)
	{
	
		this.obj.visible = (vis === 0);//set;
				
				
		// no longer needed in r-68 , vis controls stuff automatically.
		/*this.obj.traverse( function ( child ) {

				if ( child instanceof THREE.Object3D ) {

					child.visible = set;
								
				}

		} );*/

	};
	
	Acts.prototype.ObjSetCastShadow = function (vis)
	{
	
		//if(!this.model) return;
		var set;
		
		vis == 0 ? set =  false : set = true ;
		// you learn something new sometimes
		this.traversingResetFlag = true;
		
		if(this.model){
		
			this.model.castShadow = set;
				if(this.model.castShadow && this.model.receiveShadow) this.properties[41] = 3
				else if(this.model.castShadow) this.properties[41] = 1
				else this.properties[41] = 0;
			
			this.model.traverse( function ( child ) {
					// wont work well with skinned-meshes?
					if ( child instanceof THREE.Mesh ) {

						child.castShadow = set;
									
					}

			} );
			
		}else if(this.light && this.light.hasOwnProperty('shadowCamera') ){
			if(this.light.castShadow && !set){
			
				if( this.light.cameraHelper){
				this.light.cameraHelper.parent.remove(this.light.cameraHelper);
				this.light.cameraHelper = undefined;
				};
				if( this.light.shadowCamera){
				this.light.shadowCamera.parent.remove(this.light.shadowCamera);
				this.light.shadowCamera = undefined;
				};
				if(this.light.shadowMap){ 
				this.light.shadowMap.dispose();
				this.light.shadowMap = undefined;
				};
				
			};
			if(this.light.castShadow !== set){
				this.light.castShadow = set;
				this.runtime.Q3D.UpdateAllMaterials();
			};
		}
		
		

		
	};
	
	Acts.prototype.ObjSetReceiveShadow = function (vis)
	{
	
		//if(!this.model) return;
		var set;
		
		this.traversingResetFlag = true;
		
		vis == 0 ? set =  false : set = true ;

		if(this.model){
		this.model.receiveShadow = set;
			if(this.model.castShadow && this.model.receiveShadow) this.properties[41] = 3
			else if(this.model.receiveShadow) this.properties[41] = 2
			else this.properties[41] = 0;
		
			this.model.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.receiveShadow = set;
									
				}

			} );
		
		this.runtime.Q3D.UpdateAllMaterials();
		
		};
		//if(this.light ) this.light.receiveShadow = set;		
	

		
	
	};
	
	Acts.prototype.ObjSetFrustumCulled = function (vis)
	{
	
		var set;

		set = vis == 0;
		
		this.traversingResetFlag = true;
		
		this.obj.frustumCulled = set;
		

				this.obj.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.frustumCulled = set;
										
						}

				} );


	};
	
	Acts.prototype.ObjSetMatrixAutoUpdate = function (vis)
	{
	
		this.autoUpdateFlag = vis === 0; // need this because i modify matrixAutoUpdate as optimization, this fixes it so optimization never occurs in bboxchanged;

	};
	
	Acts.prototype.ObjSetMatrixUpdate = function ()
	{

		this.obj.updateMatrix();

	};
	
	Acts.prototype.ObjSetMatrix = function (Xx,Xy,Xz,Xw,Yx,Yy,Yz,Yw,Zx,Zy,Zz,Zw,Wx,Wy,Wz,Ww)
	{
	
		this.obj.matrix.set( Xx,Yx,Zx,Wx,Xy,Yy,Zy,Wy,Xz,Yz,Zz,Wz,Xw,Yw,Zw,Ww );
	
		this.set_bbox3D_changed();
	
	};
	
	Acts.prototype.ObjChangeParent = function (parent,transf)
	{
		var p = parent.getFirstPicked()
		if (!p) return;
		if(transf === 0){ //if yes
		this.fastWorldUpdate();
		p.fastWorldUpdate();
		var m = THREE.TSH.mtx0;
		m.getInverse(p.obj.matrixWorld);
		m.multiply(this.obj.matrixWorld);
		this.lastScale.copy(this.obj.scale);
		m.decompose ( this.obj.position,  this.obj.quaternion,  this.obj.scale );
		this.scaleChanged = true;
		//this.obj.quaternion.normalize();
		};
		p.obj.add(this.obj);
		this.hasQ3DObjParent = true;
		this.toplevelparent = p.toplevelparent;
		this.set_bbox3D_changed();
		
	};
	
	Acts.prototype.ObjAddChild = function (childtype,transf)
	{
		var inst = childtype.getCurrentSol().getObjects();
		var i, leni;

		if(transf === 0){
			this.fastWorldUpdate();
			var m0 = THREE.TSH.mtx0;
			var m1 = THREE.TSH.mtx1;
			m0.getInverse(this.obj.matrixWorld);
			
			for (i = 0, leni = inst.length; i < leni; i++)
			{
				inst[i].fastWorldUpdate();
				m1.multiplyMatrices( m0, inst[i].obj.matrixWorld );
				inst[i].lastScale.copy(inst[i].obj.scale);
				m1.decompose( inst[i].obj.position,  inst[i].obj.quaternion,  inst[i].obj.scale );
				inst[i].scaleChanged = true;
		
				this.obj.add(inst[i].obj);
				inst[i].hasQ3DObjParent = true;
				inst[i].toplevelparent = this.toplevelparent;
				inst[i].set_bbox3D_changed();
			};
		}else{			
			for (i = 0, leni = inst.length; i < leni; i++)
			{
				this.obj.add(inst[i].obj);
				inst[i].hasQ3DObjParent = true;
				inst[i].toplevelparent = this.toplevelparent;
				inst[i].set_bbox3D_changed();
			};
		};
	};
	
	Acts.prototype.ObjParentScene = function (transf)
	{
	
		if(transf === 0){ //if yes
		this.fastWorldUpdate();
		this.lastScale.copy(this.obj.scale);
		this.obj.matrixWorld.decompose ( this.obj.position,  this.obj.quaternion,  this.obj.scale );
		this.scaleChanged = true;
		};
		
		if(this.colDebug && this.col.type.sphere || this.col.type.AABB) this.runtime.Q3D.scene.add(this.colDebug); // debug body wont transfer to new scene without this, i think
		
		this.runtime.Q3D.scene.add(this.obj);
		this.hasQ3DObjParent = false;
		this.toplevelparent = this.obj;
		this.scene = this.runtime.Q3D.scene;
		this.set_bbox3D_changed();
	
	};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
////////////////////////////////////////////// Expressions ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	Exps.prototype.x = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.position.x);				// return our value
	};
	
	Exps.prototype.y = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.position.y);				// return our value
	};
	
	Exps.prototype.z = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.position.z);				// return our value
	};
	
	Exps.prototype.xw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set
		if(this.hasQ3DObjParent){
		this.fastWorldUpdate();
		set = this.obj.matrixWorld.elements[12]
		}
		else{
		set = this.obj.position.x
		};
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.yw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set
		if(this.hasQ3DObjParent){
		this.fastWorldUpdate();
		set = this.obj.matrixWorld.elements[13]
		}
		else{
		set = this.obj.position.y
		};
	
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.zw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set
		if(this.hasQ3DObjParent){
		this.fastWorldUpdate();
		set = this.obj.matrixWorld.elements[14]
		}
		else{
		set = this.obj.position.z
		};
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.Rx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.rotation.x*THREE.Rad2Deg);				// return our value
	};
	
	Exps.prototype.Ry = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.rotation.y*THREE.Rad2Deg);				// return our value
	};
	
	Exps.prototype.Rz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.rotation.z*THREE.Rad2Deg);				// return our value
	};
	
	Exps.prototype.Ro = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.obj.rotation.order);				// return our value
	};
	
	Exps.prototype.Sx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.scale.x);				// return our value
	};
	
	Exps.prototype.Sy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.scale.y);				// return our value
	};
	
	Exps.prototype.Sz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.scale.z);				// return our value
	};
	////////////////////////////////////////////////////////////////////////////

	Exps.prototype.nTx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.T.x);				// return our value
	};
	
	Exps.prototype.nTy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.T.y);				// return our value
	};
	
	Exps.prototype.nTz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.T.z);				// return our value
	};
	
	Exps.prototype.Td = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.Td);				// return our value
	};
	
	Exps.prototype.nNx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.N.x);				// return our value
	};
	
	Exps.prototype.nNy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.N.y);				// return our value
	};
	
	Exps.prototype.nNz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.N.z);				// return our value
	};
	
	Exps.prototype.Nd = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.Nd);				// return our value
	};
	
	Exps.prototype.nBx = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.B.x);				// return our value
	};
	
	Exps.prototype.nBy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.B.y);				// return our value
	};
	
	Exps.prototype.nBz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.B.z);				// return our value
	};
	
	Exps.prototype.Bd = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateTNB();
		
		ret.set_float(this.TNB.Bd);				// return our value
	};
	//////////////////////////////////////////////////////////////////
	
	Exps.prototype.Ux = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.up.x);				// return our value
	};
	
	Exps.prototype.Uy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.up.y);				// return our value
	};
	
	Exps.prototype.Uz = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.obj.up.z);				// return our value
	};

	Exps.prototype.Uxw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateUw();
		
		ret.set_float(this.Uw.up.x);				// return our value
	};
	
	Exps.prototype.Uyw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateUw();
		
		ret.set_float(this.Uw.up.y);				// return our value
	};
	
	Exps.prototype.Uzw = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.updateUw();
		
		ret.set_float(this.Uw.up.z);				// return our value
	};

	//////////////////////////////////////////////////////////////////////////////

	Exps.prototype.Puid = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = -1
		
		if(this.obj.parent.userData.inst) set = this.obj.parent.userData.inst.uid;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.TOPuid = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var set = -1
		
		if(this.toplevelparent.userData.inst.uid !== this.uid) set = this.toplevelparent.userData.inst.uid;
		
		ret.set_float(set);				// return our value
	};
	
	Exps.prototype.scene = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.scene.name);				// return our value
	};
	
	Exps.prototype.mM = function (ret,i)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		i = cr.clamp(i, 0, 15)
		ret.set_float(this.obj.matrix.elements[i]);				// return our value
	};
	
	Exps.prototype.mW = function (ret,i)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.fastWorldUpdate();
		i = cr.clamp(i, 0, 15)
		ret.set_float(this.obj.matrixWorld.elements[i]);				// return our value
	};

};
