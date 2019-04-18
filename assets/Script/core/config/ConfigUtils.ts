import { shuffle } from "../../basic/Array";
import * as R from "ramda";
import { Pair } from "../../basic/Types";

export module ConfigUtils {
    /**
     * 选择题 配置转换
     */

    export interface SelectionQuestionSource {
        picture: number;
        description: string;
        optionTwo: string;
        optionFour: string;
        pattern: number;
        stem: string;
        brainCircuit: number;
        comprehension: number;
        optionThree: string;
        optionOne: string;
        vocabulary: number;
        id: number;
        knowledge: number;
    }

    export interface Attributes {
        brainCircuit: number;
        comprehension: number;
        vocabulary: number;
        knowledge: number;
        pattern: number;
    }

    export interface SingleChoiceQuestion {
        id: number;
        spriteId: number;
        description: string;
        selections: Array<string>;
        answerIndex: number;
        stem: string;
        attributes: Attributes;
    }

    export function convertSingleChoiceQuestion(
        sourceInfo: SelectionQuestionSource
    ): SingleChoiceQuestion {
        let selections = shuffle([
            sourceInfo.optionOne,
            sourceInfo.optionTwo,
            sourceInfo.optionThree,
            sourceInfo.optionFour
        ]);
        let answer = sourceInfo.optionOne;
        return {
            id: sourceInfo.id,
            spriteId: sourceInfo.picture,
            description: sourceInfo.description,
            selections: selections,
            answerIndex: Math.max(selections.indexOf(answer), 0),
            stem: sourceInfo.stem,
            attributes: {
                brainCircuit: sourceInfo.brainCircuit,
                comprehension: sourceInfo.comprehension,
                vocabulary: sourceInfo.vocabulary,
                knowledge: sourceInfo.knowledge,
                pattern: sourceInfo.pattern
            }
        };
    }

    /**
     * 填空题类型转换
     */

    export interface FillTheBlankSource {
        optionWordSix: string;
        picture: number;
        optionWordTwo: string;
        optionWordEight: string;
        description: string;
        vocabulary: number;
        optionWordSeven: string;
        pattern: number;
        optionWordFive: string;
        stem: string;
        brainCircuit: number;
        optionWordThree: string;
        comprehension: number;
        knowledge: number;
        optionWordOne: string;
        id: number;
        wordAmount: number;
        optionWordFour: string;
        optionWordNine: string;
        optionWordTen: string;
    }

    export interface FillBlankQuestion {
        id: number;
        spriteId: number;
        description: string;
        stem: string;
        wordAmount: number;
        attributes: Attributes;
        words: Array<string>;
        anwsers: Array<string>;
    }

    export function convertFillTheBlank(
        source: FillTheBlankSource
    ): FillBlankQuestion {
        let words = [
            source.optionWordOne,
            source.optionWordTwo,
            source.optionWordThree,
            source.optionWordFour,
            source.optionWordFive,
            source.optionWordSix,
            source.optionWordSeven,
            source.optionWordEight,
            source.optionWordNine,
            source.optionWordTen
        ].filter(x => x != undefined);
        let anwserWords = R.take(source.wordAmount, words);
        let selections = shuffle(R.clone(words));

        return {
            id: source.id,
            spriteId: source.picture,
            description: source.description,
            words: selections,
            wordAmount: source.wordAmount,
            anwsers: anwserWords,
            stem: source.stem,
            attributes: {
                brainCircuit: source.brainCircuit,
                comprehension: source.comprehension,
                vocabulary: source.vocabulary,
                knowledge: source.knowledge,
                pattern: source.pattern
            }
        };
    }

    /**
     * 选择图
     */

    export interface ConnectionQuestionSource {
        optionWordTwo: number;
        vocabulary: number;
        optionTwo: string;
        optionWordOne: number;
        stem: string;
        brainCircuit: number;
        optionWordThree: number;
        comprehension: number;
        optionThree: string;
        pattern: number;
        optionOne: string;
        type: number;
        id: number;
        knowledge: number;
    }

    export type ConnectionQuestionType = "Chinese_to_English" | "Sprite_to_English"

    export interface ConnectionQuestion {
        id: number;
        type : ConnectionQuestionType;
        stem: string;
        leftItems: Array<string>;
        rightItems: Array<string | number>;
        attributes: Attributes;
        anwsers: {[key: string]: string | number};
    }

    export function convertConnectionQuestion(source: ConnectionQuestionSource): ConnectionQuestion {
        let leftItems = shuffle([
            source.optionOne,
            source.optionTwo,
            source.optionThree,
        ]);
        let rightItems = shuffle([
            source.optionWordOne,
            source.optionWordTwo,
            source.optionWordThree,
        ]);
        let toType = (n: number): ConnectionQuestionType  => {
            switch(n) {
                case 1: return "Chinese_to_English";
                case 2: return "Sprite_to_English";
            }
            return "Chinese_to_English";
        }
        let answers: {[key: string]: string | number} = {};
        answers[source.optionOne] = source.optionWordOne;
        answers[source.optionTwo] = source.optionWordTwo;
        answers[source.optionThree] = source.optionWordThree;

        return {
            id: source.id,
            anwsers: answers,
            type: toType(source.type), 
            stem: source.stem,
            leftItems: leftItems,
            rightItems: rightItems,
            attributes: {
                brainCircuit: source.brainCircuit,
                comprehension: source.comprehension,
                vocabulary: source.vocabulary,
                knowledge: source.knowledge,
                pattern: source.pattern
            }
        };
    }
}
