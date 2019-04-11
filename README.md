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
