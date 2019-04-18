## 一个简单的框架

仿照Elm, Halogen那样抽象事件，数据和渲染。

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
import { BehaviorSubject, Subject } from "rxjs";
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
export class Example1 extends BaseComponent<State, Action> {
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
        this.actions = new Subject<Action>();
        // this.minusButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Dec", value: unit}));
        // this.plusButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Inc", value: unit}));
        // this.maxButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Set", value: this.MAX_SIZE}));
        this.onTouchEnd(this.minusButton.node, ActionUnit("Dec"));
        this.onTouchEnd(this.plusButton.node, ActionUnit("Inc"));
        this.onTouchEnd(this.maxButton.node, Action("Set", this.MAX_SIZE));
        this.state = {
            count: new BehaviorSubject<number>(200)
        };
        this.actions.subscribe({ next: action => this.eval(action) });
        this.state.count.subscribe({ next: count => this.render(count)});
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