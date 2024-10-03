# ExetendStructureManager
ScriptAPI上でストラクチャの保存可能サイズを無限にします。

## 使い方

```javascript
import { world } from "@minecraft/server";
import { ExetendStructureManager } from "./ExetendStructureManager.js";

const dimension = world.getDimension("overworld");

ExetendStructureManager.save("data_1", dimension, { x:0, y:0, z:0 }, { x:200, y:50, z:200 }); //undefined
ExetendStructureManager.place("data_1", dimension, { x:10, y:0, z:10 }); //undefined

const structure = ExetendStructureManager.get("data_1"); //data_1
structure.size; //{ x:200, y:50, z:200 }
structure.id; //"data_1"

ExetendStructureManager.getAllIds(); //["data_1"]

ExetendStructureManager.delete("data_1"); //true
```

## Method

- `static save(id, Dimension, Vector3, Vector3): void`  
  ストラクチャを保存します。

- `static place(id, Dimension, Vector3): void`  
  保存したストラクチャを設置します。

- `static get(id): Structure`  
  ストラクチャデータを取得します。
  
- `static delete(id): boolean`  
  ストラクチャを削除します。

- `static getAllIds(): string[]`  
  ストラクチャのidをすべて取得します
