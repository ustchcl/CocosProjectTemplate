## 一个简单的框架

仿照Elm, Halogen那样抽象事件，数据和渲染。

### :coffee:新版本预览
- 使用mobx管理状态, 感觉比rxjs更舒服好用, 
- 自己定义action配合ramda 更新状态 嗯姆
```typescript
import { modify, TimeInfo, timeInfo, formatNum } from "../basic/BaseFunction";
import { BaseComponent } from "../basic/BaseComponent";
import {max, subtract, pipe, min, add, __} from "ramda";

import { observable, autorun, computed } from "mobx";

const {ccclass, property} = cc._decorator

class State {
    @observable
    count: number = 0;

    @observable
    timestamp: number = Date.now();

    @computed
    get time() {
        return timeInfo(this.timestamp);
    } 
}

type Action 
    = ["Inc"]
    | ["Dec"] 
    | ["Set", number]
    

@ccclass
export class CounterExample extends BaseComponent<State, Action> {
    @property(cc.Button)
    minusButton: cc.Button = null;
    @property(cc.Button)
    plusButton: cc.Button = null;
    @property(cc.Label)
    contentLabel: cc.Label = null;
    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.Button)
    maxButton: cc.Button = null;

    readonly MAX_SIZE = 999;

    start () {
        this.onTouchEnd(this.minusButton.node, ["Dec"]);
        this.onTouchEnd(this.plusButton.node, ["Inc"]);
        this.onTouchEnd(this.maxButton.node, ["Set", this.MAX_SIZE]);
        this.state = new State();
        this.subs = [
            autorun(() => this.renderCounter(this.state.count)),
            autorun(() => this.renderTimeInfo(this.state.time))
        ]
        this.schedule(() => this.setState({"timestamp": Date.now()}), 1);
    }

    eval (action: Action) {
        switch (action[0]) {
            case "Dec": {
                this.modify({"count": pipe(subtract(__, 1), max(0))})
                break;
            }
            case "Inc": {
                this.modify({"count": pipe(add(1), min(this.MAX_SIZE))});
                break;
            }
            case "Set": {
                this.setState({"count": action[1]});
                break;
            }
        }
    }

    renderTimeInfo(ti: TimeInfo) {
        this.timeLabel.string = `${formatNum(ti.hour, 2)}:${formatNum(ti.minute, 2)}:${formatNum(ti.seconds, 2)}`;
    }

    renderCounter(count: number) {
        this.contentLabel.string = String(count);
    }
}

```


### 更新 07.08
**1. 添加subs**   
BaseComponent在destroy时，会将subs全部unsubscribe  

```typescript
// BaseComponent.ts
export abstract class BaseComponent<State, Action extends Type<any, any>> extends cc.Component implements Component<State, Action> {
    subs: Array<Subscription> = [];

    onDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}

// Example.ts
@ccclass 
export class CounterExample extends BaseComponent<State, Action> {
    start () {
        this.subs = [
            this.state.count.subscribe({ next: count => this.render(count)})
        ]
    }
}
```

**2. safeRemove修改**  
现在safeRemove默认调用`node.destroy()`



### 新更新
1. 二次确认框
```typescript
// 此处定义，需要二次确认框的类型及其可能的初始化参数
export type SecondConfirmType 
    = TypeUnit<"ExitSecondConfirm">
    | Type<"SaveConfig", Pair<number, number>>

export async function showSC(type: SecondConfirmType): Promise<boolean> {
    let sc: SecondConfirm = null;
    switch (type.typeName) {
        case "ExitSecondConfirm": {
            let prefab = await ResUtils.prefab("exitSecondConfirm");
            let node = cc.instantiate(prefab);
            sc = node.getComponent(ExitSecondConfirm);
            GlobalEnv.getInstance().dispatchAction(Action("OpenPanelWithNode", node));
            break;
        }

        case "SaveConfig": {
            let prefab = await ResUtils.prefab("saveConfig");
            let node = cc.instantiate(prefab);
            let saveConfig = node.getComponent(SaveConfig);
            saveConfig.init(type.value.fst, type.value.snd);
            sc = saveConfig;
            GlobalEnv.getInstance().dispatchAction(Action("OpenPanelWithNode", node));
            break;
        }
    }

    return new Promise<boolean>(function(resolve) {
        sc.cancelBtn.node.on(TOUCH_END, () => {
            safeRemove(sc.node);
            resolve(false);
        });
        sc.yesBtn.node.on(TOUCH_END, () => {
            safeRemove(sc.node);
            resolve(true);
        });
    });
}

// usage
async function sthOnClick () {
    if (await showSC(Action("SaveConfig", mkPair(param1, param2)))) {
        // 用户点击确认
    } else {
        // 用户点击取消
    }
}
```

2. BaseFunction.ts  
更新一系列函数

3. 去掉了无用的action

4. Json载入测试
```json
// test.json
{
    "first": {
        "id": 1,
        "content": "one"
    }
}
```

```typescript
import * as test from "./test.json" // 或者 import test from "./test.json"

console.log(test.first.id === 1); // OK
console.log(test.first.content === 1); // Error
```

**测试结果**
CocosCreator编译会报错  
但是编译到微信小游戏里面可以正常载入Json


> 在 tsconfig.json `compilerOptions`里面添加  
> "resolveJsonModule": true


## 关于消息
传统Message传递  
```typescript
// pureMVC
class XXX extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "XXXMediator";

    public constructor(viewComponent: any) {
        super(GameMenuMediator.NAME, viewComponent);
    }


    public listNotificationInterests(): Array<any> {
        return [GameProxy.SCORE_UPDATE, GameProxy.SCORE_RESET];
    }
    
    public handleNotification(notification: puremvc.INotification): void {
        var data: any = notification.getBody(); // 这个地方是any
        switch (notification.getName()) {
            case GameProxy.SCORE_UPDATE: {
               break;
            }
            case GameProxy.SCORE_RESET: {
               break;
            }
        }
    }
}
```

消息传递只是定义了消息的名字，对消息的内容的类型并没有限定，需要靠约定。  
自己定义`消息的类型和消息体的类型`  
```typescript

export type GlobalAction
    = Type<"OpenPanelWithNode", cc.Node>  // 定义消息体类型： cc.Node
    | TypeUnit<"BackToMainPage">  // 消息内容为unit


function handleAction(action: GlobalAction) {
    switch (action.typeName) {
        case "OpenPanelWithNode": { // 消息类型可以提示，写错会提示
            let node = action.value; // node的类型会被自动推断为cc.Node, 调用不是cc.Node的方法会报错
            break;
        }
        case "BackToMainPage": {
            // action.value 为 unit
            break;
        }
    }
}
```






- `eval` 处理事件, 根据事件更新`state`
  - 所有的逻辑，case处理，应仅有次数可以更新state
- `render` 根据`state`渲染，可以由多个绑定到State里面各个Behavior上
- `state` 明确定义的State, 内部由一个以上的BehaviorSubject构成
- `Action` 对事件的统一抽象。需要自己定义。 定义该组件可能会产生的交互行为，包括
  - UI交互 
  - 网络请求
  - 定时器

```elm
import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)

main =
  Browser.sandbox { init = init, update = update, view = view }

type Msg = Increment | Decrement

type alias Model = Int  -- state

init : Model
init = 0

update msg model =      -- eval
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1

view model =            -- render
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]
```


```typescript
import { Type, TypeUnit, ActionUnit, Action } from "../basic/Types";
import { BehaviorSubject } from "rxjs";
import { __, add, always } from "ramda"
import { modify } from "../basic/BaseFunction";
import { BaseComponent } from "../basic/BaseComponent";

const {ccclass, property} = cc._decorator

interface State {
    count: BehaviorSubject<number>;
}

type Action 
    = TypeUnit<"Inc">
    | TypeUnit<"Dec"> 
    | Type<"Set", number>

@ccclass
export class CounterExample extends BaseComponent<State, Action> {
    @property(cc.Button)
    minusButton: cc.Button = null;
    @property(cc.Button)
    plusButton: cc.Button = null;
    @property(cc.Label)
    contentLabel: cc.Label = null;
    @property(cc.Button)
    maxButton: cc.Button = null;

    readonly MAX_SIZE = 999;

    start () {
        this.onTouchEnd(this.minusButton.node, ActionUnit("Dec"));
        this.onTouchEnd(this.plusButton.node, ActionUnit("Inc"));
        this.onTouchEnd(this.maxButton.node, Action("Set", this.MAX_SIZE));
        this.state = {
            count: new BehaviorSubject<number>(200)
        };
        this.subs = [
            this.state.count.subscribe({ next: count => this.render(count)})
        ]
    }

    render(count: number) {
        this.contentLabel.string = String(count);
    }

    eval (action: Action) {
        switch (action.typeName) {
            case "Dec": {
                let count = this.state.count.getValue();
                if (count > 0) {
                    modify(this.state.count, add(__, -1))
                }
                break;
            }
            case "Inc": {
                let count = this.state.count.getValue();
                if (count < this.MAX_SIZE) {
                    modify(this.state.count, add(__, 1))
                }
                break;
            }
            case "Set": {
                modify(this.state.count, always(action.value));
                break;
            }
        }
    }
}
```

## 定义ADT类型

```typescript
type Type<T, U> = {typeName: T, value: U}
type TypeUnit<T> = Type<T, Unit>

type RemoteData<Ok, Err> 
    = TypeUnit<"NotAsked"> 
    | TypeUnit<"Loading"> 
    | Type <"Success", Ok> 
    | Type <"Failure", Err>
```

参考Purescript/Haskell定义ADT
```haskell
data RemoteData e a
  = NotAsked
  | Loading
  | Failure e
  | Success a
``` 
 
## Cocos Creator V2.0 以上的 Shader
首先一个cocos creator(version >= 2.0) 用的shader类型如下
```Typescript

interface Shader {
    name: string,
    defines: Array<{ name : string }>,
    vert: string,
    frag: string,
}

const DefaultVert: string  = 
`
uniform mat4 viewProj;
uniform mat4 model;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
    mat4 mvp;
    mvp = viewProj * model;
    vec4 pos = mvp * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}
`


```

fragmentShader与shadetoy上不一样的地方有
首先，shader的输入变量如下： 可自行定义，需要在glsl中修改
```typescript
let mainTech = new renderer.Technique(
    ['transparent'],
    [
        { name: 'texture', type: renderer.PARAM_TEXTURE_2D },   // 纹理 iChannel0, shadertoy上使用iChannel0的地方请替换为texture
        { name: 'color', type: renderer.PARAM_COLOR4 },         // 当前的颜色值
        { name: 'pos', type: renderer.PARAM_FLOAT3 },           // iResolution
        { name: 'size', type: renderer.PARAM_FLOAT2 },          // size, 可用来计算fragCoord
        { name: 'time', type: renderer.PARAM_FLOAT },           // iTime
        { name: 'num', type: renderer.PARAM_FLOAT }             
    ],
    [pass]
);
```

其次  
```glsl
// 开头的变量声明， 变量名字可以使用shadertoy的着色器输入变量，不过在ShaderMaterial中需修改
// 其mainTech对应的值
uniform sampler2D texture;
uniform vec3 pos;
uniform float time;
uniform vec2 size;
varying vec2 uv0; // 这个是额外的变量， 用于计算fragCorrd, 应该是引擎传入的当前坐标的相关信息;
```

最后  
```glsl
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // code
}

void main() {
    // 首先要先计算出所使用的fragCoord
    vec2 fragCoord = vec2(uv0.x * size.x - 0.5 * size.x, 0.5 * size.y - uv0.y * size.y);
    // code
}
```
