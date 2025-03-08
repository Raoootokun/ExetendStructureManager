import { world, Dimension, Structure, StructureCreateOptions, StructurePlaceOptions } from "@minecraft/server";


export class ExetendStructureManager {

    static MAX_SIZE = { x: 64, y: 384, z: 64 };

    /**
     * @param {string} id 
     * @param {Dimension} dimension 
     * @param {Vector3} fromPos 
     * @param {Vector3} toPos 
     * @param {StructureCreateOptions} options
     */
    static save(id, dimension, fromPos, toPos, options) {

        
        const structureManager = world.structureManager;

        const minPos = { x:Math.min(fromPos.x, toPos.x), y:Math.min(fromPos.y, toPos.y), z:Math.min(fromPos.z, toPos.z) };
        const maxPos = { x:Math.max(fromPos.x, toPos.x), y:Math.max(fromPos.y, toPos.y), z:Math.max(fromPos.z, toPos.z) };
        const size = { 
            x: Math.abs(minPos.x - maxPos.x) + 1, 
            y: Math.abs(minPos.y - maxPos.y) + 1, 
            z: Math.abs(minPos.z - maxPos.z) + 1, 
        };

        const posData = {
            xAxis: [],
            yAxis: [],
            zAxis: []
        };

        //----------------------------------------
        const divideDataX = this.#divide(size.x, this.MAX_SIZE.x);
        //分割する回数だけ回す
        for(let i=1; i<=divideDataX.count; i++) {
            const start = minPos.x + (this.MAX_SIZE.x * (i-1));
            const end = start + this.MAX_SIZE.x - 1;

            posData.xAxis.push({ start: start, end: end });
        };
        //あまりがあるなら
        if(divideDataX.remainder > 0) {
            const data = posData.xAxis[posData.xAxis.length-1];
            const start = (data?.end ?? minPos.x - 1)  + 1;
            const end = start + divideDataX.remainder - 1;
            
            posData.xAxis.push({ start: start, end: end });
        };
        //----------------------------------------


        //----------------------------------------
        const divideDataZ = this.#divide(size.z, this.MAX_SIZE.z);
        //分割する回数だけ回す
        for(let i=1; i<=divideDataZ.count; i++) {
            const start = minPos.z + (this.MAX_SIZE.z * (i-1));
            const end = start + this.MAX_SIZE.z - 1;

            posData.zAxis.push({ start: start, end: end });
        };
        //あまりがあるなら
        if(divideDataZ.remainder > 0) {
            const data = posData.zAxis[posData.zAxis.length-1];
            const start = (data?.end ?? minPos.z - 1) + 1;
            const end = start + divideDataZ.remainder - 1;
            
            posData.zAxis.push({ start: start, end: end });
        };
        
        //----------------------------------------


        //----------------------------------------
        const divideDataY = this.#divide(size.y, this.MAX_SIZE.y);
        //分割する回数だけ回す
        for(let i=1; i<=divideDataY.count; i++) {
            const start = minPos.y + (this.MAX_SIZE.y * (i-1));
            const end = start + this.MAX_SIZE.y - 1;

            posData.yAxis.push({ start: start, end: end });
        };
        //あまりがあるなら
        if(divideDataY.remainder > 0) {
            const data = posData.yAxis[posData.yAxis.length-1];
            const start = (data?.end ?? minPos.y - 1) + 1;
            const end = start + divideDataY.remainder - 1;
            
            posData.yAxis.push({ start: start, end: end });
        };
        //----------------------------------------

        
        for(const xData of posData.xAxis) {
            for(const zData of posData.zAxis) {
                for(const yData of posData.yAxis) {
                    const startPos = { x: xData.start, y: yData.start, z: zData.start, };
                    const endPos = { x: xData.end, y: yData.end, z: zData.end, };
                    const localSize = {
                        x: Math.abs(startPos.x - endPos.x) + 1,
                        y: Math.abs(startPos.y - endPos.y) + 1,
                        z: Math.abs(startPos.z - endPos.z) + 1,
                    };

                    //初期位置からどのくらい各方向に足しているか
                    const add = {
                        x: Math.abs(minPos.x - startPos.x),
                        y: Math.abs(minPos.y - startPos.y),
                        z: Math.abs(minPos.z - startPos.z),
                    };

                    const _id_ = `exst:${id}/${add.x}/${add.y}/${add.z}/${localSize.x}/${localSize.y}/${localSize.z}/${size.x}/${size.y}/${size.z}`;
                 

                    structureManager.delete(_id_);
                    const res = structureManager.createFromWorld(_id_, dimension, startPos, endPos, options);
                };
            };
        };
    };


    /**
     * @param {string} id 
     * @param {Dimension} dimension 
     * @param {Vector3} pos 
     * @param {StructurePlaceOptions} options 
     */
    static place(id, dimension, pos, options) {
        const structureManager = world.structureManager;
        const _idStart_ = `exst:${id}`;

        const ids = structureManager.getWorldStructureIds().filter(_id_ => { if(_id_.startsWith(_idStart_))return _id_; });
        if(ids.length == 0)return false;

        const mirror = options?.mirror;
        const rotation = options?.rotation;

        let maxSize;
        let maxPos;
        let _maxPos_;
        const ary = [];
        for(const _id_ of ids) {
            const idAry = _id_.split("/");
            if(!maxSize)maxSize = {
                x: idAry[7] * 1,
                y: idAry[8] * 1,
                z: idAry[9] * 1,
            };
            if(!maxPos)maxPos = {
                x: pos.x + maxSize.x - 1,
                y: pos.y + maxSize.y - 1,
                z: pos.z + maxSize.z - 1,
            };

            const add = {
                x: idAry[1] * 1,
                y: idAry[2] * 1,
                z: idAry[3] * 1,
            };
            const localSize = {
                x: idAry[4] * 1,
                y: idAry[5] * 1,
                z: idAry[6] * 1,
            };
            
            const placePos = {
                x: pos.x + add.x,
                y: pos.y + add.y,
                z: pos.z + add.z,
            };
            let placeEndPos = {
                x: placePos.x + localSize.x - 1,
                y: placePos.y + localSize.y - 1,
                z: placePos.z + localSize.z - 1,
            };

            if(maxSize.x > this.MAX_SIZE.x || maxSize.y > this.MAX_SIZE.y || maxSize.z > this.MAX_SIZE.z) {
                if(rotation == "Rotate90") {
                    placePos.z = pos.z + add.x;

                    const absA = maxPos.z - placeEndPos.z; //設置座標の最大Xと最大サイズの差
                    const absB = maxSize.x - absA;

                    placePos.x = maxPos.x - absB + 1;
                };
    
                if(rotation == "Rotate270") {
                    placePos.x = pos.x + add.z;
    
                    const absA = maxPos.x - placeEndPos.x; //設置座標の最大Xと最大サイズの差
                    const absB = maxSize.z - absA;
    
                    placePos.z = maxPos.z - absB + 1;
                };
    
                if(rotation == "Rotate180") {
                    placePos.x = maxPos.x - add.x - localSize.x + 1;
                    placePos.z = maxPos.z - add.z - localSize.z + 1;
                };
    
    
                if(mirror == "X" || mirror == "XZ") {
                    const absA = maxPos.z - placeEndPos.z; //設置座標の最大Xと最大サイズの差
                    const absB = maxSize.z - absA;

                    placePos.z = pos.z - absB + maxSize.z;
                };
                if(mirror == "Z" || mirror == "XZ") {
                    const absA = maxPos.x - placeEndPos.x; //設置座標の最大Xと最大サイズの差
                    const absB = maxSize.x - absA;

                    placePos.x = pos.x - absB + maxSize.x;
                };
            };
            
            ary.push({
                id: _id_,
                idAry: idAry,
                add: add,
                placePos: placePos,
            });
        }; 
 
        for(const data of ary) {
            structureManager.place(data.id, dimension, data.placePos, { mirror:mirror, rotation:rotation });
        };

        return true;
    };


    /**
     * 
     * @param {string} id 
     * @returns {Structure | undefined}
     */
    static get(id) {
        const structureManager = world.structureManager;

        const ids = structureManager.getWorldStructureIds().filter(_id_ => { if(_id_.startsWith(`exst:${id}`))return _id_; });
        if(ids.length == 0)return undefined;

        for(const _id_ of ids) {
            const idAry = _id_.split("/");
            const size = {
                x: idAry[7] * 1,
                y: idAry[8] * 1,
                z: idAry[9] * 1,
            };

            return {
                id: id,
                size: size,
            }
        };
    };

    /**
     * @returns {string[]}
     */
    static getAllIds() {
        const structureManager = world.structureManager;

        const ids = structureManager.getWorldStructureIds().filter(_id_ => { if(_id_.startsWith(`exst`))return _id_; });

        const ary = [];
        for(const id of ids) {
            const idAryLaw = id.split(":");
            const idAry = idAryLaw[1].split("/");
            const _id_ = idAry[0];
            if(!ary.includes(_id_))ary.push(_id_);
        };
        
        return ary;
    };

    static deleteAll() {
        const structureManager = world.structureManager;

        const ids = structureManager.getWorldStructureIds().filter(id => { if(id.startsWith("exst:"))return id; });
        for(const _id_ of ids) {
            structureManager.delete(_id_);
        };
        
    };

    /**
     * @param {string} id 
     * @returns {boolean}
     */
    static delete(id) {
        const structureManager = world.structureManager;

        const ids = structureManager.getWorldStructureIds().filter(_id_ => { if(_id_.startsWith(`exst:${id}`))return _id_; });
        if(ids.length == 0)return false;
        for(const _id_ of ids) {
            structureManager.delete(_id_);
        };

        return true;
    };


    static #divide(length, maxLength) {
        return {
            remainder: length % maxLength,
            count:  Math.floor( length / maxLength ),
        };
    };

};
