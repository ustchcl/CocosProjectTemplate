import { Fn } from './Types';

/**
 * 这是一个组件的定义
 * - `state`:  代表该组件的状态，是一个随时间变化的值，`render` subcribe `state`
 * - `render`: 根据传入的`state`，绘制所要显示的数据
 * - `eval`: 根据传入的`action`，modify组件的`state`
 */
export interface Component<State, Action>  {
    state: State;
    eval(action: Action): void;
    query<T>(extractor: Fn<State, T>): T;
}
