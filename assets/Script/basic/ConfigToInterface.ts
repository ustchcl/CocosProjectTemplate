const input = {
    optionWordTwo: 69.0,
    vocabulary: 6,
    optionTwo: "have seed",
    optionWordOne: 16.0,
    stem: "将下列英文和含义相同的图片一一对应。",
    brainCircuit: 1,
    optionWordThree: 70.0,
    comprehension: 2,
    optionThree: "back fruit",
    pattern: 0,
    optionOne: "egg yellow",
    type: 2,
    id: 5010,
    knowledge: 1
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

// const Max = 866278171;

// import * as R from "ramda"

// let howMany = 0;
// let count = 1;
// while (count <= Max) {
//     let str = String(count);
//     howMany += str.length - R.replace('3', '', str).length;
//     count += 2;
// }
// console.log(howMany);