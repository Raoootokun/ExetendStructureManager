# ExetendStructureManager
ScriptAPI上でストラクチャの保存可能サイズを無限にします。

## 使い方

```javascript
import { world } from "@minecraft/server";
import { ExetendStructureManager } from "./ExetendStructureManager.js";

const overworld = world.getDimension("overworld");

//保存
ExetendStructureManager.save("data_1", overworld, { x:0, y:0, z:0 }, { x:200, y:50, z:200 }); //undefined

//設置
ExetendStructureManager.place("data_1", overworld, { x:10, y:0, z:10 }); //undefined

//取得
const structure = ExetendStructureManager.get("data_1"); //Strcuture
structure.size; //{ x:200, y:50, z:200 }
structure.id; //"data_1"

//全IDを取得
ExetendStructureManager.getAllIds(); //[ "data_1" ]

//削除
ExetendStructureManager.delete("data_1"); //true
```

## Method

- `static save(id, Dimension, Vector3, Vector3, options): void`  
  ストラクチャを保存します。

- `static place(id, Dimension, Vector3, options): void`  
  保存したストラクチャを設置します。

- `static get(id): Structure`  
  ストラクチャデータを取得します。

- `static getAllIds(): string[]`  
  ストラクチャのidをすべて取得します
  
- `static delete(id): boolean`  
  ストラクチャを削除します。

- `static deleteAll(): void`  
  全てのストラクチャを削除します。
