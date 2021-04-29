		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 3D SPATIAL HASH TO SPEED UP COLLISION DETECTION
		//////////////////////////////////////// ADAPTED FROM THE CODE CONSTRUCT USES FOR SPARSE 2D SPATIAL HASHING

THREE.TSH = {};

(function(){
		
	function SparseGrid3D_(cellwidth_, cellheight_,celldepth_,type_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.celldepth = celldepth_;
		this.typeRef = type_;
		
		/**PREVIEWONLY**/this.gridCellDebug = false;
		/**PREVIEWONLY**/this.fillCellDebug = false;
		// Using string properties derived from numbers to store if a grid cell
		// is present, e.g. this.cells["-6"]["4"]
		this.cells = {};
	};
	
	SparseGrid3D_.prototype.totalCellCount = 0;
	
	SparseGrid3D_.prototype.getCell = function (x_, y_,z_,create_if_missing)
	{
		var ret;
		
		if (!this.cells[x_])
		{
			if (create_if_missing)
			{
				ret = allocGridCell3D(this, x_, y_,z_);
				this.cells[x_] = {};
				this.cells[x_][y_] = {};
				this.cells[x_][y_][z_] = ret;
				
				return ret;
			}
			else
				return null;
		}
		
		if (!this.cells[x_][y_])
		{
			if (create_if_missing)
			{
				ret = allocGridCell3D(this, x_, y_,z_);
				this.cells[x_][y_] = {};
				this.cells[x_][y_][z_] = ret;
				return ret;
			}
			else
				return null;
		}
		
		ret = this.cells[x_][y_][z_];
		
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocGridCell3D(this, x_, y_,z_);
			this.cells[x_][y_][z_] = ret;
			return ret;
		}
		else
			return null;
	};
	
	SparseGrid3D_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	
	SparseGrid3D_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	
	SparseGrid3D_.prototype.ZToCell = function (z_)
	{
		return cr.floor(z_ / this.celldepth);
	};
	
	SparseGrid3D_.prototype.Wipe = function (cellwidth_, cellheight_,celldepth_,force)
	{
		/*var str = ""
		for (var key in this.cells){ str = str+key+",\n" };
		alert(str);*/
		if(cellwidth_ === this.cellwidth && cellheight_ === this.cellheight && celldepth_ === this.celldepth && !force) return; // there's nothing new to do.
		
		var x,y,z,cell;
		//get rid of all the old cells;
		for(x in this.cells){
			for(y in this.cells[x]){
				for(z in this.cells[x][y]){
				
				cell = this.getCell(x, y, z, false);
				if(cell){
				/**BEGIN-PREVIEWONLY**/
				if( cell.box ){
					this.typeRef.runtime.Q3D.scene.remove(cell.box);
					cell.box = null;
				};
				/**END-PREVIEWONLY**/
				freeGridCell3D(cell);
				};
				this.cells[x][y][z] = null; // may need a delete operator to get rid of everything properly, but whatever, well add it if its necessary and causes bugs, yet to be tested POTENTIAL BUG;
				
				};		
			};		
		};
		
		
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.celldepth = celldepth_;

		
		//modified from updateAllCells
		var i, len, instances = this.typeRef.instances;
		for (i = 0, len = instances.length; i < len; ++i)
		{
			instances[i].cell3D_changed = true;
			instances[i].collcells3Dt.max.set(-1,-1,-1);
			instances[i].collcells3Dt.min.set(0,0,0);
			instances[i].update_collision_cell3D();
		}
		
		// include anything on createrow
		// this is necessary so that just created objects can collide, but not sure how well this is working in Q3D context.
		
		var createRow = this.typeRef.runtime.createRow//this.createRow;
		
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === this.typeRef){
				createRow[i].cell3D_changed = true;
				createRow[i].collcells3Dt.max.set(-1,-1,-1);
				createRow[i].collcells3Dt.min.set(0,0,0);
				createRow[i].update_collision_cell3D();
			};
		}
		
		this.typeRef.any_cell3D_changed = false; //everything was updated?;
		//alert("wiping");
		
	};
	
	SparseGrid3D_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, z, lenz, cell;

		// If no old range provided, must be new object, so just insert it across
		// the new range.
		if (oldrange)
		{
			// Iterate old range removing this instance (where old range does not overlap new range)
			// Note ranges are inclusive!
			for (x = oldrange.min.x, lenx = oldrange.max.x; x <= lenx; ++x) // BROKEN BECAUSE I STARTED USING TMPRC3Dt
			{
				for (y = oldrange.min.y, leny = oldrange.max.y; y <= leny; ++y)
				{
					for (z = oldrange.min.z, lenz = oldrange.max.z; z <= lenz; ++z)
					{
						THREE.TSH.vec0.set(x,y,z);
						if (newrange && newrange.containsPoint( THREE.TSH.vec0 ))
							continue;	// is still in this cell
						
						cell = this.getCell(x, y, z, false);	// don't create if missing
						
						if (!cell)
							continue;	// cell does not exist yet
						
						cell.remove(inst);
						
						// recycle the cell if it's now empty
						if (cell.isEmpty())
						{
							/**PREVIEWONLY**/ if( cell.box ) this.typeRef.runtime.Q3D.scene.remove(cell.box);
							freeGridCell3D(cell);
							this.cells[x][y][z] = null;
						}
					}
				}
			}
		}
		
		// If no new range provided, must be being destroyed, so remove across the old range.
		if (newrange)
		{
			// Iterate the new range inserting this instance (where new range does not
			// overlap old range)
			for (x = newrange.min.x, lenx = newrange.max.x; x <= lenx; ++x)
			{
				for (y = newrange.min.y, leny = newrange.max.y; y <= leny; ++y)
				{
					for (z = newrange.min.z, lenz = newrange.max.z; z <= lenz; ++z)
					{
					THREE.TSH.vec0.set(x,y,z);
					if (oldrange && oldrange.containsPoint( THREE.TSH.vec0 ))
						continue;	// is still in this cell
					
					// create the cell if missing and insert the object.
					// note if already in the cell, does nothing.
					this.getCell(x, y, z, true).insert(inst);
					}
				}
			}
		}
		
	};
	
	SparseGrid3D_.prototype.queryRange = function (rc, result)
	{
		var x, lenx, ystart, y, leny, z , lenz, zstart, cell;
		
		x = this.XToCell(rc.min.x);
		ystart = this.YToCell(rc.min.y);
		zstart = this.ZToCell(rc.min.z);
		lenx = this.XToCell(rc.max.x);
		leny = this.YToCell(rc.max.y);
		lenz = this.ZToCell(rc.max.z);
		
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y) // y/z start values are needed since nested.
			{
				for (z = zstart; z <= lenz; ++z)
				{
					cell = this.getCell(x, y, z, false);
					
					if (!cell)
						continue;
					
					cell.dump(result);
				}
			}
		}
	};
	
	THREE.TSH.SparseGrid3D = SparseGrid3D_;
	
	var gridcell3Dcache = [];
	
	function allocGridCell3D(grid_, x_, y_,z_)
	{
		var ret;
		
		SparseGrid3D_.prototype.totalCellCount++;
		
		if (gridcell3Dcache.length)
		{
			ret = gridcell3Dcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			ret.z = z_; // this sufficient ?
			
			/**BEGIN-PREVIEWONLY**/
			if(grid_.gridCellDebug)
			if(ret.box){ 
			ret.box.scale.set(grid_.cellwidth*0.5, grid_.cellheight*0.5, grid_.celldepth*0.5);
			ret.box.position.x = (x_+0.5)*grid_.cellwidth
			ret.box.position.y = (y_+0.5)*grid_.cellheight
			ret.box.position.z = (z_+0.5)*grid_.celldepth
			ret.box.material.color.setRGB( 0, 0, 0 );
			grid_.typeRef.runtime.Q3D.scene.add(ret.box);
			}else ret.createDebug(grid_.typeRef.runtime.Q3D.scene);			
			/**END-PREVIEWONLY**/
			
			return ret;
		}
		else

			return new THREE.TSH.GridCell3D(grid_, x_, y_,z_);
	};
	
	function freeGridCell3D(c)
	{
		SparseGrid3D_.prototype.totalCellCount--;
		
		c.objects.clear();
		
		if (gridcell3Dcache.length < 1000)
			gridcell3Dcache.push(c);
	};
	
	function GridCell3D_(grid_, x_, y_,z_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.z = z_;
		this.objects = new cr.ObjectSet();
		
		// testing debug feature
		/**BEGIN-PREVIEWONLY**/
		 if(grid_.gridCellDebug)
		{
		this.createDebug(grid_.typeRef.runtime.Q3D.scene);
		}
		/**END-PREVIEWONLY**/
	};
	
	/**BEGIN-PREVIEWONLY**/
	GridCell3D_.prototype.createDebug = function (scene)
	{
			if(this.grid.fillCellDebug){ 
			this.box = new THREE.Mesh(THREE.TSH.Bgeom, new THREE.MeshBasicMaterial());
			this.box.material.transparent = true;
			this.box.material.opacity = 0.5;
			//this.box.material.side= THREE.DoubleSide;
			//this.box.frustumCulled = false;
			}
			else this.box = new THREE.OldBoxHelper();
			//this.box = new THREE.OldBoxHelper();//new THREE.Mesh(THREE.TSH.Bgeom, new THREE.MeshBasicMaterial())
			
			this.box.scale.set(this.grid.cellwidth*0.5, this.grid.cellheight*0.5, this.grid.celldepth*0.5);
			this.box.position.x = (this.x+0.5)*this.grid.cellwidth
			this.box.position.y = (this.y+0.5)*this.grid.cellheight
			this.box.position.z = (this.z+0.5)*this.grid.celldepth
			this.box.material.color.setRGB( 0, 0, 0 );

			scene.add(this.box);
	};
	/**END-PREVIEWONLY**/
	
	GridCell3D_.prototype.isEmpty = function ()
	{
		return this.objects.isEmpty();
	};
	
	GridCell3D_.prototype.insert = function (inst)
	{
	this.objects.add(inst);
		
		/**BEGIN-PREVIEWONLY**/
		 if(this.box){
		 var c = this.objects.count()
		 this.box.material.color.setRGB( c/30 , 1- Math.min(c/90,1), c/300 );
		 if(this.box.material.transparent) this.box.material.opacity = Math.min(c/90+0.1,0.7);
		};
		/**END-PREVIEWONLY**/
	};
	
	GridCell3D_.prototype.remove = function (inst)
	{
	this.objects.remove(inst);
	
		/**BEGIN-PREVIEWONLY**/
		 if(this.box){
		 var c = this.objects.count()
		 this.box.material.color.setRGB( c/30 , 1- Math.min(c/90,1), c/300 );
		 if(this.box.material.transparent) this.box.material.opacity = Math.min(c/90+0.1,0.7);
		};
		/**END-PREVIEWONLY**/

	};
	
	GridCell3D_.prototype.dump = function (result)
	{
		cr.appendArray(result, this.objects.valuesRef());
	};
	
	THREE.TSH.GridCell3D = GridCell3D_;
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	THREE.TSH.updateAllCells = function (type)
	{
		
		if (!type.any_cell3D_changed)
			return;		// all instances must already be up-to-date

		//type.collision_grid3D.Wipe(type.collision_grid3D.cellwidth,type.collision_grid3D.cellheight,type.collision_grid3D.celldepth,false);
		// it might be a good idea to make the collision cell system invisible to users
		
		var i, len, instances = type.instances;
		for (i = 0, len = instances.length; i < len; ++i)
		{
			instances[i].update_collision_cell3D();
		}
		
		// include anything on createrow
		// this is necessary so that just created objects can collide, but not sure how well this is working in Q3D context.
		
		var createRow = type.runtime.createRow//this.createRow;
		
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === type)
				createRow[i].update_collision_cell3D();
		}
		
		type.any_cell3D_changed = false;
	};
	
	// Collect candidates for grid cell collisions
	THREE.TSH.getCollisionCandidates = function (rtype, bbox, candidates)
	{		
		var i, len, t;
		//var is_parallaxed = (layer ? (layer.parallaxX !== 1 || layer.parallaxY !== 1) : false);
		
		// Need to update bounding boxes first so all objects get updated to their correct buckets
		if (rtype.is_family)
		{
			for (i = 0, len = rtype.members.length; i < len; ++i)
			{
				t = rtype.members[i];
				
				THREE.TSH.updateAllCells(t);
				t.collision_grid3D.queryRange(bbox, candidates);
			}
		}
		else
		{
				THREE.TSH.updateAllCells(rtype);
				rtype.collision_grid3D.queryRange(bbox, candidates);
		}
		//THREE.TSH.TestString1 = String(candidates); // just for testing
	};
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//alert("tmprc3D");
	//THREE.TSH.tmprc3D = new cr.rect(0, 0, 0, 0);
	
	THREE.TSH.update_collision_cell3D = function ()
	{		
		if (!this.cell3D_changed || !this.collisionsEnabled)
			return;
		
		this.update_bbox3D();
		// need to update this function
		var mygrid = this.type.collision_grid3D;
		var collcells = this.collcells3Dt;
		var bbox = this.col.geometry.boundingBox;		
		
		THREE.TSH.tmprc3Dt.min.set(mygrid.XToCell(bbox.min.x),mygrid.YToCell(bbox.min.y),mygrid.ZToCell(bbox.min.z));     // MODIFY TO 3D
		THREE.TSH.tmprc3Dt.max.set(mygrid.XToCell(bbox.max.x),mygrid.YToCell(bbox.max.y),mygrid.ZToCell(bbox.max.z)); // MODIFY TO 3D
		
		
		// No change: no need to update anything
		
		if (collcells.equals(THREE.TSH.tmprc3Dt))
			return;
		
		// Update in sparse grid
		if (collcells.max.x < collcells.min.x)
			mygrid.update(this, null, THREE.TSH.tmprc3Dt);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, collcells, THREE.TSH.tmprc3Dt);
		
		// Update my current collision cells

		collcells.copy(THREE.TSH.tmprc3Dt);
		
		/**PREVIEWONLY**/ this.runtime.movedcell_count++;
		
		this.cell3D_changed = false;
		
	};
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Fast 3D AABB overlap testing function
	
	THREE.TSH.intersect_AABBs = function (rc,lc)
	{
		return !(rc.max.x < lc.min.x || rc.max.y < lc.min.y || rc.max.z < lc.min.z || rc.min.x > lc.max.x || rc.min.y > lc.max.y || rc.min.z > lc.max.z);
	};
	
	// Fast Arvo Algo for AABB vs Sphere collision test. http://stackoverflow.com/questions/4578967/cube-sphere-intersection-test
	
	THREE.TSH.intersect_AABB_sphere = function (AABB, sphere) 
	{
    var dist_squared = sphere.radius*sphere.radius;
    // assume C1 and C2 are element-wise sorted, if not, do that now ???
    if (sphere.center.x < AABB.min.x) dist_squared -= (sphere.center.x - AABB.min.x)*(sphere.center.x - AABB.min.x);
    else if (sphere.center.x > AABB.max.x) dist_squared -= (sphere.center.x - AABB.max.x)*(sphere.center.x - AABB.max.x);
    if (sphere.center.y < AABB.min.y) dist_squared -= (sphere.center.y - AABB.min.y)*(sphere.center.y - AABB.min.y)
    else if (sphere.center.y > AABB.max.y) dist_squared -= (sphere.center.y - AABB.max.y)*(sphere.center.y - AABB.max.y);
    if (sphere.center.z < AABB.min.z) dist_squared -= (sphere.center.z - AABB.min.z)*(sphere.center.z - AABB.min.z)
    else if (sphere.center.z > AABB.max.z) dist_squared -= (sphere.center.z - AABB.max.z)*(sphere.center.z - AABB.max.z);
    return dist_squared > 0;
	};
	
	THREE.TSH.intersect_OBB_sphere = function (OBB, sph) 
	{
	//return true;
	var dist_squared = sph.radius*sph.radius;
	var AABB = THREE.TSH.box0;
	var v = THREE.TSH.vec0;
	var m = OBB.InverseMatrix.elements;
	
	AABB.min.x = -1*OBB.AbsScale.x;
	AABB.min.y =  -1*OBB.AbsScale.y;
	AABB.min.z = -1*OBB.AbsScale.z;
	
	AABB.max.x = OBB.AbsScale.x;
	AABB.max.y = OBB.AbsScale.y;
	AABB.max.z = OBB.AbsScale.z;	
	
	var sphere = THREE.TSH.sph0;
	
	v.x = (sph.center.x-OBB.AbsPosition.x);
	v.y = (sph.center.y-OBB.AbsPosition.y);
	v.z = (sph.center.z-OBB.AbsPosition.z);
	
	sphere.center.x = v.x*m[0]+v.y*m[3]+v.z*m[6];
	sphere.center.y = v.x*m[1]+v.y*m[4]+v.z*m[7];
	sphere.center.z = v.x*m[2]+v.y*m[5]+v.z*m[8];	
	
	// the rest is copied from AABB sphere collision, could make it a function call if i wanted, but ill leave this for now
	//AABB
	
    // assume C1 and C2 are element-wise sorted, if not, do that now ???
    if (sphere.center.x < AABB.min.x) dist_squared -= (sphere.center.x - AABB.min.x)*(sphere.center.x - AABB.min.x);
    else if (sphere.center.x > AABB.max.x) dist_squared -= (sphere.center.x - AABB.max.x)*(sphere.center.x - AABB.max.x);
    if (sphere.center.y < AABB.min.y) dist_squared -= (sphere.center.y - AABB.min.y)*(sphere.center.y - AABB.min.y)
    else if (sphere.center.y > AABB.max.y) dist_squared -= (sphere.center.y - AABB.max.y)*(sphere.center.y - AABB.max.y);
    if (sphere.center.z < AABB.min.z) dist_squared -= (sphere.center.z - AABB.min.z)*(sphere.center.z - AABB.min.z)
    else if (sphere.center.z > AABB.max.z) dist_squared -= (sphere.center.z - AABB.max.z)*(sphere.center.z - AABB.max.z);
    return dist_squared > 0;
	};
	
	//https://d3cw3dd2w32x2b.cloudfront.net/wp-content/uploads/2012/06/obb-vs-obb.pdf
	
	THREE.TSH.intersect_OBBs = function (O, o)
	{
	// carefully design this to not hammer the garbage collection, dont create needless Vector3s
	
	var m, M, v, r , R, d ,dN , T , A , i , k;
	
	m = o.AbsRotationMatrix.elements;
	M = O.AbsRotationMatrix.elements;
	r = o.AbsScale;
	R = O.AbsScale;
	v = THREE.TSH.vec0.subVectors( o.AbsPosition, O.AbsPosition );
	T = THREE.TSH.arr0;
	A = THREE.TSH.arr1;
	Q = THREE.TSH.arr2;
	
	for (i = 0; i < 3; i++) {
		for (k = 0; k < 3; k++) { 

		T[i][k] = m[ i*4 ]*M[ k*4 ]+m[ i*4+1 ]*M[ k*4+1 ]+m[ i*4+2 ]*M[ k*4+2 ] ;
		A[i][k] = Math.abs(T[i][k]) ;
		
		Q[i][k] = Math.abs((m[i*4+1] * M[k*4+2] - m[i*4+2] * M[k*4+1])*v.x+(m[i*4+2] * M[k*4] - m[i*4] * M[k*4+2])*v.y+(m[i*4] * M[k*4+1] - m[i*4+1] * M[k*4])*v.z);
		}
	}
	
	d = THREE.TSH.vec1.set(m[0],m[1],m[2]);
	dN = Math.abs(d.dot(v));
	
	//alert(R.x)
	
	if(dN > r.x + R.x*A[0][0] + R.y*A[0][1] + R.z*A[0][2] ) return false
	
	d = THREE.TSH.vec1.set(m[4],m[5],m[6]);
	dN = Math.abs(d.dot(v));
	
	if(dN > r.y + R.x*A[1][0] + R.y*A[1][1] + R.z*A[1][2] ) return false
	
	d = THREE.TSH.vec1.set(m[8],m[9],m[10]);
	dN = Math.abs(d.dot(v));
	
	if(dN > r.z + R.x*A[2][0] + R.y*A[2][1] + R.z*A[2][2] ) return false
	
	///////////////////////////
	
	d = THREE.TSH.vec1.set(M[0],M[1],M[2]);
	dN = Math.abs(d.dot(v));
	
	if(dN > R.x + r.x*A[0][0] + r.y*A[1][0] + r.z*A[2][0] ) return false
	
	d = THREE.TSH.vec1.set(M[4],M[5],M[6]);
	dN = Math.abs(d.dot(v));
	
	if(dN > R.y + r.x*A[0][1] + r.y*A[1][1] + r.z*A[2][1] ) return false
	
	d = THREE.TSH.vec1.set(M[8],M[9],M[10]);
	dN = Math.abs(d.dot(v));
	
	if(dN > R.z + r.x*A[0][2] + r.y*A[1][2] + r.z*A[2][2] ) return false
	
	//////////////////////////
	
	if(Q[0][0] > r.y*A[2][0]+r.z*A[1][0]+R.y*A[0][2]+R.z*A[0][1]) return false
	if(Q[0][1] > r.y*A[2][1]+r.z*A[1][1]+R.x*A[0][2]+R.z*A[0][0]) return false
	if(Q[0][2] > r.y*A[2][2]+r.z*A[1][2]+R.x*A[0][1]+R.y*A[0][0]) return false
	
	if(Q[1][0] > r.x*A[2][0]+r.z*A[0][0]+R.y*A[1][2]+R.z*A[1][1]) return false
	if(Q[1][1] > r.x*A[2][1]+r.z*A[0][1]+R.x*A[1][2]+R.z*A[1][0]) return false
	if(Q[1][2] > r.x*A[2][2]+r.z*A[0][2]+R.x*A[1][1]+R.y*A[1][0]) return false
	
	if(Q[2][0] > r.x*A[1][0]+r.y*A[0][0]+R.y*A[2][2]+R.z*A[2][1]) return false
	if(Q[2][1] > r.x*A[1][1]+r.y*A[0][1]+R.x*A[2][2]+R.z*A[2][0]) return false
	if(Q[2][2] > r.x*A[1][2]+r.y*A[0][2]+R.x*A[2][1]+R.y*A[2][0]) return false
	
	//////////////////
	
	return true;
	
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// because objects can be in heiarchies, detecting collisions for OBB's or ellipsoids will need information about their absolute position/scale/rotation
	// this ATTEMPTS to be a fast method for determining those from the world transform, derived form the Matrix4.decompose() function .
	// this function is given to col, so that any "this" will reference the col object.
	
	// UNTESTED
	
	THREE.TSH.decompose = function () {

		var vector = this.AbsScale;
		var matrix = this.AbsRotationMatrix;
		var inv = this.InverseMatrix;

		

			var te = this.matrixWorld.elements

			var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale ?
			/*var det = this.matrixWorld.determinant();
			if ( det < 0 ) {
				sx = - sx;
			}*/

			this.AbsPosition.x = te[ 12 ];
			this.AbsPosition.y = te[ 13 ];
			this.AbsPosition.z = te[ 14 ];

			// scale the rotation part

			matrix.elements.set( this.matrixWorld.elements ); // at this point matrix is incomplete so we can't use .copy()

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;

			matrix.elements[ 0 ] *= invSX;
			matrix.elements[ 1 ] *= invSX;
			matrix.elements[ 2 ] *= invSX;

			matrix.elements[ 4 ] *= invSY;
			matrix.elements[ 5 ] *= invSY;
			matrix.elements[ 6 ] *= invSY;

			matrix.elements[ 8 ] *= invSZ;
			matrix.elements[ 9 ] *= invSZ;
			matrix.elements[ 10 ] *= invSZ;
			
			// inverse matrix is the transpose of the rotation matrix, this is the transpose/inverse, used for collision tests with spheres.
			
			inv.elements[ 0 ] = matrix.elements[ 0 ];
			inv.elements[ 4 ] = matrix.elements[ 5 ];
			inv.elements[ 8 ] = matrix.elements[ 10 ];
			
			inv.elements[ 1 ] = matrix.elements[ 4 ];
			inv.elements[ 2 ] = matrix.elements[ 8 ];
			
			inv.elements[ 3 ] = matrix.elements[ 1 ];
			inv.elements[ 5 ] = matrix.elements[ 9 ];
			
			inv.elements[ 6 ] = matrix.elements[ 2 ];
			inv.elements[ 7 ] = matrix.elements[ 6 ];
			
			/*matrix.elements[ 12 ] = 0;
			matrix.elements[ 13 ] = 0;
			matrix.elements[ 14 ] = 0;*/

			//quaternion.setFromRotationMatrix( matrix );
			// we need the rotation matrix, not the quaternion that led to it.

			// radii are needed for collision stuff, not actual 'scaling factor', so divide by 2, this caused bugs because i hadn't noticed.
				
			this.AbsScale.x = sx/2;
			this.AbsScale.y = sy/2;
			this.AbsScale.z = sz/2;

			//return this; no return is needed, since values of col are updated. this saves the garbage collector a bit of work and makes more sense.

		
		
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	THREE.TSH.testOverlap = function (a, b)
	{
		// Instances don't overlap themselves.  Also return false early if either object has collisions disabled.
		if (!a || !b || a === b || !a.collisionsEnabled || !b.collisionsEnabled || a.toplevelparent.parent !== b.toplevelparent.parent) //reject based on scene difference, equality of objects etc.
			return false;

		/**PREVIEWONLY**/ this.collisioncheck_count++;
		a.update_bbox3D();
		b.update_bbox3D();
	
	// update the world matrix chain for these objects so axis aligned bounding box is accurately rebuilt even if parenting is present.
		// this is probably expensive so some super sub-broadphase check before might be useful / only updating objects when they have to be updated.

		
			// Reject via bounding spheres first (fastest)
			if (!a.col.geometry.boundingSphere.intersectsSphere(b.col.geometry.boundingSphere))
				return false;
				
			if (a.col.type.sphere && b.col.type.sphere)
				return true;
			
			// Reject via bounding boxes next (might not be faster than skipping this step altogether, must test)	
			if (!THREE.TSH.intersect_AABBs(a.col.geometry.boundingBox,b.col.geometry.boundingBox))
				return false;
				
			if (a.col.type.AABB && b.col.type.AABB)
				return true;
				

			
			//// this can be optimized probably, why check both cases separately, this is just to ensure the function gets its objects passed in the right order.			
			if (a.col.type.AABB && b.col.type.sphere)
				return THREE.TSH.intersect_AABB_sphere(a.col.geometry.boundingBox, b.col.geometry.boundingSphere);
			if (b.col.type.AABB && a.col.type.sphere)
				return THREE.TSH.intersect_AABB_sphere(b.col.geometry.boundingBox, a.col.geometry.boundingSphere);
			
			
			if (a.col.type.OBB && b.col.type.sphere)
				return THREE.TSH.intersect_OBB_sphere(a.col, b.col.geometry.boundingSphere);
			if (b.col.type.OBB && a.col.type.sphere)
				return THREE.TSH.intersect_OBB_sphere(b.col, a.col.geometry.boundingSphere);	
			
			// test for OBBs vs OBBs or AABBs
			if(a.col.type.OBB || a.col.type.AABB && b.col.type.OBB || a.col.type.AABB )
				return THREE.TSH.intersect_OBBs(a.col,b.col);


				
			// else return true if everything else fails
			
			//return true;
	};
	
	// pulled from cr.set_bbox_changed, its probably safe to use the same flags, so i will (for now) this might cause bugs in the future though... dont change anything ashley!!!
	
	THREE.TSH.set_bbox3D_changed = function (flag,pflag)
	{
		
			this.obj.matrixAutoUpdate = this.autoUpdateFlag; // need an override incase user wants to build world matrix manually (well I want this for some stuff at least)
			this.col.matrixAutoUpdate = true;
			if(this.model) this.model.matrixAutoUpdate = true;
			
			this.TNB.needsUpdate = true;
			this.Uw.needsUpdate = true;
			
			this.obj.matrixWorldNeedsUpdate = true;
			
			//this.set_bbox_changed();
			
			this.type.any_cell3D_changed = true;
			this.cell3D_changed = true;
			this.bbox3D_changed = true;
			//this.obj.matrixWorldNeedsUpdate = true;
			
			for ( var i = 0, l = this.obj.children.length; i < l; i ++ ) {
	
				if(this.obj.children[ i ].userData.inst){ 
				this.obj.children[ i ].userData.inst.toplevelparent = this.toplevelparent;
				this.obj.children[ i ].userData.inst.set_bbox3D_changed(); //recursively flag the changes of children since bbox is outdated if a higher level member changes
				};

			};
			// This stuff should be left up to the original bbox update function?
			//this.bbox_changed = true;      		// will recreate next time box requested
			//this.cell_changed = true;
			//this.type.any_cell_changed = true;	// avoid unnecessary updateAllBBox() calls
			//this.runtime.redraw = true;     	// assume runtime needs to redraw
			//bbox changed callbacks, what are these?
			// call bbox changed callbacks
			//var i, len, callbacks = this.bbox_changed_callbacks;
			//for (i = 0, len = callbacks.length; i < len; ++i)
			//{
			//	callbacks[i](this);
			//}
			
		if(!flag){ // update stuff for behaviours to work properly :/
			this.x = this.obj.position.x;
			this.y = this.obj.position.y;
			this.z = this.obj.position.z;
			if(this.SFLAG){
			this.width = this.obj.scale.x;
			this.height = this.obj.scale.y;
			}
			this.angle = this.obj.rotation.z;
		}

		if(this.pBod && !pflag){ // callback for when physics are enabled, pflag so this isn't called when physics is calling bboxchanged, but when anything else does it updates the physics body
			
			// might be a good idea to "kill" velocity, but it's hard to judge when this will be a "good idea" it should be the game creators job, i don't know the type of behaviour they want really.
			//this.pBod.body.angularVelocity.init();
			this.pBod.body.orientation.x = this.obj.quaternion.x;
			this.pBod.body.orientation.y = this.obj.quaternion.y;
			this.pBod.body.orientation.z = this.obj.quaternion.z;
			this.pBod.body.orientation.s = this.obj.quaternion.w;
			
			//this.pBod.body.orientation.copy(this.pBod.body.newOrientation);
			//this.pBod.body.controlRot = true
		
			//this.pBod.body.newPosition.x = this.obj.position.x* OIMO.INV_SCALE;
			//this.pBod.body.newPosition.y = this.obj.position.y* OIMO.INV_SCALE;
			//this.pBod.body.newPosition.z = this.obj.position.z* OIMO.INV_SCALE;
			//this.pBod.body.linearVelocity.x = 0;
			//this.pBod.body.linearVelocity.y = 0;
			//this.pBod.body.linearVelocity.z = 0;
			
			this.pBod.body.position.x = this.obj.position.x* OIMO.INV_SCALE;
			this.pBod.body.position.y = this.obj.position.y* OIMO.INV_SCALE;
			this.pBod.body.position.z = this.obj.position.z* OIMO.INV_SCALE;
			
			this.pBod.needsSync = true;
			
						
			// box
			/*if(this.pBod.shape.type === OIMO.SHAPE_BOX &&( this.pBod.shape.width !== this.obj.scale.x*OIMO.INV_SCALE || this.pBod.shape.height !== this.obj.scale.y*OIMO.INV_SCALE ||  this.pBod.shape.depth !== this.obj.scale.z*OIMO.INV_SCALE) ){

				this.pBod.shapeScaled = true;

				this.pBod.shape.width = this.obj.scale.x*OIMO.INV_SCALE;
				this.pBod.shape.height = this.obj.scale.y*OIMO.INV_SCALE;
				this.pBod.shape.depth = this.obj.scale.z*OIMO.INV_SCALE;
				
				this.pBod.shape.halfWidth = this.pBod.shape.width*0.5;
				this.pBod.shape.halfHeight = this.pBod.shape.height*0.5;
				this.pBod.shape.halfDepth = this.pBod.shape.depth*0.5;
			
			}
			// sphere
			if(this.pBod.shape.type === OIMO.SHAPE_SPHERE &&( this.pBod.shape.radius !== this.obj.scale.x*0.5*OIMO.INV_SCALE ) ){
			//alert('tsssss')
				this.pBod.shapeScaled = true;

				this.pBod.shape.radius = this.obj.scale.x*0.5*OIMO.INV_SCALE;
				
				this.pBod.shape.relativePosition.x=1;
			
			}
			// cylinder
			if(this.pBod.shape.type === OIMO.SHAPE_CYLINDER &&( this.pBod.shape.radius !== this.obj.scale.x*0.5*OIMO.INV_SCALE || this.pBod.shape.height !== this.obj.scale.y*OIMO.INV_SCALE ) ){
				//alert(this.pBod.shape.radius+" : "+ this.obj.scale.x*0.5*OIMO.INV_SCALE+" ::: "+this.pBod.shape.height+" : "+this.obj.scale.y*OIMO.INV_SCALE)
				this.pBod.shapeScaled = true;
				//alert('tsssss')
				this.pBod.shape.radius = this.obj.scale.x*0.5*OIMO.INV_SCALE;
				this.pBod.shape.height = this.obj.scale.y*OIMO.INV_SCALE;
				
				this.pBod.shape.halfHeight = this.pBod.shape.height*0.5;
			
			}*/
			
			//alert('test')
			//this.pBod.body.controlPos = true		
			//this.pBod.body.setPosition(this.obj.position);
			
			if(this.scaleChanged){ //important for resizing , you need to uniformly resize the object to not mess up relative stuff, this is the only way it can properly work since skewed shapes are not supported, and resizing necessarily busts them.
				
				var delta = THREE.TSH.vec0
				delta.set(this.obj.scale.x/this.lastScale.x,this.obj.scale.y/this.lastScale.y,this.obj.scale.z/this.lastScale.z);
				
				this.pBod.shapeScaled = true;
				// loop through all the shapes (? linked list starts with first element ?)
				for(var shape=this.pBod.body.shapes;shape!=null;shape=shape.next){
				
					if(shape.type === OIMO.SHAPE_BOX){
						
						shape.width = shape.width*delta.x;
						shape.height = shape.height*delta.y;
						shape.depth = shape.depth*delta.z;
						
						shape.halfWidth = shape.width*0.5;
						shape.halfHeight = shape.height*0.5;
						shape.halfDepth = shape.depth*0.5;

					}else if(shape.type === OIMO.SHAPE_SPHERE){
						
						shape.radius = shape.radius*delta.x;

					}else if(shape.type === OIMO.SHAPE_CYLINDER){
						
						shape.radius = shape.radius*delta.x;
						shape.height = shape.height*delta.y;
				
						shape.halfHeight = shape.height*0.5;

					};
					
					shape.relativePosition.x *= delta.x;
					shape.relativePosition.y *= delta.y;
					shape.relativePosition.z *= delta.z;
				
				};
			
			};
			
		};

		
		this.scaleChanged = false;
		//this.lastScale.copy(this.obj.scale);
		
	};
		
	THREE.TSH.update_bbox3D = function ()
	{
		//var parent;
		
		if (!this.bbox3D_changed) return;
		this.bbox3D_changed = false;
		//this.obj.updateMatrix();
		//alert("updating bbox");
		
		//alert("test");
		// should this be here?
		//this.update_bbox();
		if(!this.collisionsEnabled) return;
		//this.col.updateMatrix();
		
		this.fastWorldUpdate();
		//at worst a frame off, but in most cases i think it will work out properly. I think the cost of recursively rechecking everything each object is just too high.
		//performance of this multilevel check seems to converge to the performance of a naive one on only the object so that's very good!!!
		
		//if(this.properties[6]===0||this.properties[6]===2) 
		//this.col.geometry.boundingSphere.radius = Math.sqrt((this.col.scale.x*this.col.scale.x+this.col.scale.y*this.col.scale.y+this.col.scale.z*this.col.scale.z)/4);
		
		this.col.geometry.boundingSphere.copy(THREE.TSH.sphere);
		//this.col.geometry.boundingSphere.applyMatrix4( this.col.matrixWorld );
		//this.col.geometry.boundingSphere.center.set
		
		var e = this.col.matrixWorld.elements
		//alert(e[15]);
		this.col.geometry.boundingSphere.center.set(e[12],e[13],e[14]);
		if(this.col.type.sphere&&this.properties[24]===0){
		var maxScale = Math.sqrt(Math.max(e[0]*e[0]+e[1]*e[1]+e[2]*e[2],e[4]*e[4]+e[5]*e[5]+e[6]*e[6],e[8]*e[8]+e[9]*e[9]+e[10]*e[10]))/2;
		this.col.geometry.boundingSphere.radius = maxScale;
		};
		if(this.col.type.OBB||this.col.type.sphere&&this.properties[24]===1){
		this.col.geometry.boundingSphere.radius = Math.sqrt( (e[0]+e[4]+e[8])*(e[0]+e[4]+e[8]) + (e[1]+e[5]+e[9])*(e[1]+e[5]+e[9]) + (e[2]+e[6]+e[10])*(e[2]+e[6]+e[10]) )/2;
		}
		if(this.col.type.sphere&&this.properties[24]===undefined){ // special case for bone kind of a hack i should fix
		this.col.geometry.boundingSphere.radius = Math.sqrt( (e[0]+e[4]+e[8])*(e[0]+e[4]+e[8]) + (e[1]+e[5]+e[9])*(e[1]+e[5]+e[9]) + (e[2]+e[6]+e[10])*(e[2]+e[6]+e[10]) )/2;		
		}
		
		var s = this.col.geometry.boundingSphere;
		
		if(!this.col.type.sphere)
		this.col.geometry.boundingBox.setFromObject(this.col);
		else{
		// Sphere bounding boxes have to be set differently, or they're overly large;
		this.col.geometry.boundingBox.min.set(s.center.x-s.radius,s.center.y-s.radius,s.center.z-s.radius);
		this.col.geometry.boundingBox.max.set(s.center.x+s.radius,s.center.y+s.radius,s.center.z+s.radius);
		
		}
		
		var b = this.col.geometry.boundingBox;
		
		if(this.col.type.AABB){ this.col.geometry.boundingSphere.radius = Math.sqrt( (b.min.x-b.max.x)*(b.min.x-b.max.x) + (b.min.y-b.max.y)*(b.min.y-b.max.y) + (b.min.z-b.max.z)*(b.min.z-b.max.z) )/2;
			
			// manually build the "OBB info" normally generated by this.col.decompose() for OBBs, from the AABB that this uses DO NOT ADD COL.DECOMPOSE HERE IT DOES ITS JOB QUICKER/BETTER
			this.col.AbsPosition.x = (this.col.geometry.boundingBox.min.x+this.col.geometry.boundingBox.max.x)/2;
			this.col.AbsPosition.y = (this.col.geometry.boundingBox.min.y+this.col.geometry.boundingBox.max.y)/2;
			this.col.AbsPosition.z = (this.col.geometry.boundingBox.min.z+this.col.geometry.boundingBox.max.z)/2;
			
			this.col.AbsScale.x = (this.col.geometry.boundingBox.max.x-this.col.geometry.boundingBox.min.x)/2;
			this.col.AbsScale.y = (this.col.geometry.boundingBox.max.y-this.col.geometry.boundingBox.min.y)/2;
			this.col.AbsScale.z = (this.col.geometry.boundingBox.max.z-this.col.geometry.boundingBox.min.z)/2;
			
			this.col.AbsRotationMatrix.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1 );
			
		};
		
		if(this.col.type.OBB){
		// this might not be the best place for this
		this.col.decompose();
		};
		
		
		//this.bbox.set(b.min.x, b.min.y, b.max.x, b.max.y);
		//this.bquad.set_from_rect(this.bbox);
		//alert("rebuilding")
		
		// fix the debug body to look right for bounding spheres?

		
		/*if (!this.bbox_changed)
			return;                 // bounding box not changed
		
		var bbox = this.bbox;
		var bquad = this.bquad;

		// Get unrotated box
		bbox.set(this.x, this.y, this.x + this.width, this.y + this.height);
		bbox.offset(-this.hotspotX * this.width, -this.hotspotY * this.height);

		// Not rotated
		if (!this.angle)
		{
			bquad.set_from_rect(bbox);    // make bounding quad from box
		}
		else
		{
			// Rotate to a quad and store bounding quad
			bbox.offset(-this.x, -this.y);       			// translate to origin
			bquad.set_from_rotated_rect(bbox, this.angle);	// rotate around origin
			bquad.offset(this.x, this.y);      				// translate back to original position

			// Generate bounding box from rotated quad
			bquad.bounding_box(bbox);
		}
		
		// Normalize bounding box in case of mirror/flip
		bbox.normalize();

		this.bbox_changed = false;  // bounding box up to date*/
	};
	
	THREE.TSH.fastWorldUpdate = function ()
	{		
		if(!this.obj.matrixWorldNeedsUpdate) return;
		
		var parent;
		
		// FORCE MATRIX WORLD UPDATE
		if(this.toplevelparent.matrixWorldNeedsUpdate){
		//cache the highest level parent for a fast bulk update
		this.toplevelparent.updateMatrixWorld();				
		
		this.obj.matrixAutoUpdate = false;
		this.col.matrixAutoUpdate = false;
		if(this.model) this.model.matrixAutoUpdate = false;
		
		return;
		
		}
		else if(this.obj.parent.matrixWorldNeedsUpdate){ 
		//worst case scenario, we know the top level parent before the scene is updated
		//but not which parent between this object and that one, we have to climb backwards up the tree
		//this is slow but shouldn't have to be done excessively, hopefully works as I imagine without major caveats.
			parent = this.obj.parent
			while(parent.parent.matrixWorldNeedsUpdate){
			parent = parent.parent;
			};
			parent.updateMatrixWorld();
			
			
			this.obj.matrixAutoUpdate = false;
			this.col.matrixAutoUpdate = false;
			if(this.model) this.model.matrixAutoUpdate = false;
			
			return;			
		};
		// If everything else passes, update the object individually
		this.obj.updateMatrixWorld();
		
		this.obj.matrixAutoUpdate = false;
		this.col.matrixAutoUpdate = false;
		if(this.model) this.model.matrixAutoUpdate = false;
	
	};
	
}());