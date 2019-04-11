const input = {
    optionWordSix: "泉",
    picture: 40063,
    optionWordTwo: "陌",
    optionWordEight: "落",
    description: "purple road",
    vocabulary: 20,
    optionWordSeven: "碧",
    pattern: 0,
    optionWordFive: "黄",
    stem: "输入以下词组的中文",
    brainCircuit: 4,
    optionWordThree: "红",
    comprehension: 2,
    knowledge: 4,
    optionWordOne: "紫",
    id: 40048,
    wordAmount: 2,
    optionWordFour: "尘",
}




function json2Types(input: any): string {
    let json = input;
    let result = "{"
    let type = "";
    for (let key in json) {
        if (typeof json[key] == "string") {
            type = "string";
        } else if (typeof json[key] == "number") {
            type = "number";
        } else if (json[key] instanceof Array) {
            if (json[key].length == 0) {
                type = "Array<any>";
            } else {
                type = "Array<" +  json2Types(json[key][0]) + ">";
            }
        } else if (json[key] instanceof Object) { 
            type = json2Types(json[key])
        }

        result += key + ": " + type + ",\n";
    }
    return result + "}";
}

console.log(json2Types(input))