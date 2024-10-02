import { world, system } from "@minecraft/server";

export class ExetendStructureManager {
    static MAX_SIZE = { x: 64, y: 384, z: 64 };
   
    /**
     * @param {string} id 
     * @param {Dimension} dimension 
     * @param {Vector3} from 
     * @param {Vector3} to 
     */
    static save(id, dimension, from, to) {
        const minLoca = { x:Math.min(from.x, to.x), y:Math.min(from.y, to.y), z:Math.min(from.z, to.z) };
        const maxLoca = { x:Math.max(from.x, to.x), y:Math.max(from.y, to.y), z:Math.max(from.z, to.z) };
        
        const size = getSize(minLoca, maxLoca);
        const locaData = {
            x: [],
            y: [],
            z: []
        };

        const xData = divide(size.x, this.MAX_SIZE.x);
        for(let i=0; i<xData.count; i++){
            const startNum = minLoca.x + ((this.MAX_SIZE.x-1)*i) + i;
            const endNum = minLoca.x + ((this.MAX_SIZE.x-1)*i) + (this.MAX_SIZE.x-1) + i;
            locaData.x.push({
                startNum: startNum,
                endNum: endNum
            });
        };
        if(xData.remainder > 0){
            const startNum = minLoca.x + (xData.count*this.MAX_SIZE.x)
            const endNum = minLoca.x + (xData.count*this.MAX_SIZE.x) + xData.remainder-1
            locaData.x.push({
                startNum: startNum,
                endNum: endNum
            });
        };

   
        const zData = divide(size.z, this.MAX_SIZE.z);
        for(let i=0; i<zData.count; i++){
            const startNum = minLoca.z + ((this.MAX_SIZE.z-1)*i) + i;
            const endNum = minLoca.z + ((this.MAX_SIZE.z-1)*i) + (this.MAX_SIZE.z-1) + i;
            locaData.z.push({
                startNum: startNum,
                endNum: endNum
            });
        };
        if(zData.remainder > 0){
            const startNum = minLoca.z + (zData.count*this.MAX_SIZE.z)
            const endNum = minLoca.z + (zData.count*this.MAX_SIZE.z) + zData.remainder-1
            locaData.z.push({
                startNum: startNum,
                endNum: endNum
            });
        };


        const yData = divide(size.y, this.MAX_SIZE.y);
        for(let i=0; i<yData.count; i++){
            const startNum = minLoca.y + ((this.MAX_SIZE.y-1)*i) + i;
            const endNum = minLoca.y + ((this.MAX_SIZE.y-1)*i) + (this.MAX_SIZE.y-1) + i;
            locaData.y.push({
                startNum: startNum,
                endNum: endNum
            });
        };
        if(yData.remainder > 0){
            const startNum = minLoca.y + (yData.count*this.MAX_SIZE.y)
            const endNum = minLoca.y + (yData.count*this.MAX_SIZE.y) + yData.remainder-1
            locaData.y.push({
                startNum: startNum,
                endNum: endNum
            });
        };

        const idName = id;
        const structureManager = world.structureManager;

        for(const locasX of locaData.x){
            for(const locasZ of locaData.z){
                for(const locasY of locaData.y){
                    const startLoca = { x: locasX.startNum, y: locasY.startNum, z: locasZ.startNum };
                    const endLoca = { x: locasX.endNum, y: locasY.endNum, z: locasZ.endNum };

                    const minLoca__ = { x:Math.min(startLoca.x, endLoca.x), y:Math.min(startLoca.y, endLoca.y), z:Math.min(startLoca.z, endLoca.z) };
                    const addLoca = { 
                        x: Math.abs(minLoca.x - minLoca__.x), 
                        y: Math.abs(minLoca.y - minLoca__.y), 
                        z: Math.abs(minLoca.z - minLoca__.z), 
                    };
                    

                    const idLoca = JSON.stringify(addLoca).replace(/:/g, "_____");
                    const idSize = JSON.stringify(size).replace(/:/g, "_____");
                    const id = `/esm/${idName}/ary/${idLoca}/ary/${idSize}`;

                    structureManager.delete(id);
                    structureManager.createFromWorld(id, dimension, startLoca, endLoca, { saveMode:"Memory" });
                     
                };
            };
        };
    };

    /**
     * @param {string} id 
     * @returns {boolean}
     */
    static delete(id) {
        const structureManager = world.structureManager;
        const strucIds = structureManager.getWorldStructureIds().filter(id__ => { if(id__.startsWith(`/esm/${id}`))return id__; });
        for(const strucId of strucIds){
            structureManager.delete(strucId);
        };
        if(strucIds)return true;
        return false;
    };

    /**
     * @returns {string[]}
     */
    static getAllIds() {
        const ids =  world.structureManager.getWorldStructureIds().filter(id__ => { if(id__.startsWith(`/esm/`))return id__; });
        
        const ary = [];
        for(const id of ids){
            const strucId = id.replace(`/esm/`, ``).split("/ary/")[0];
            if(!ary.includes(strucId))ary.push(strucId);
        };
        return ary;
    };

    /**
     * @param {string} id 
     * @param {Dimension} dimension 
     * @param {Vector3} location
     */
    static place(id, dimension, location) {
        const structureManager = world.structureManager;
        const strucIds = structureManager.getWorldStructureIds().filter(id__ => { if(id__.startsWith(`/esm/${id}`))return id__; });

        system.runJob(place__());
        function* place__() {
            for(const strucId of strucIds){
                const idAry = strucId.split("/ary/");
                const addLoca = JSON.parse(idAry[1].replace(/_____/g, ":"));
                const allSize = JSON.parse(idAry[2].replace(/_____/g, ":"));
                const size = structureManager.get(strucId).size;
                
                let placeLoca = {
                    x:location.x + addLoca.x,
                    y:location.y + addLoca.y,
                    z:location.z + addLoca.z,
                };

                structureManager.place(strucId, dimension, placeLoca);
                yield;
            };
        };
    };

    /**
     * @param {string} id 
     * @returns {Structure}
     */
    static get(id) {
        const structureManager = world.structureManager;
        const strucIds = structureManager.getWorldStructureIds().filter(id__ => { if(id__.startsWith(`/esm/${id}`))return id__; });
        const size = JSON.parse(strucIds[0].split("/ary/")[2].replace(/_____/g, ":"));

        return {
            id: id,
            size: size,
        };
    };
};

function divide(number, a) {
    return {
        remainder: number % a,
        count:  Math.floor( number / a )
    };
};

function getSize(pos1, pos2) {
    const size = { 
        x: Math.abs(pos1.x - pos2.x) +1, 
        y: Math.abs(pos1.y - pos2.y) +1, 
        z: Math.abs(pos1.z - pos2.z) +1, 
    };
    return size;
};
