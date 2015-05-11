/**
 * Data models
 */
Apperyio.Entity = new Apperyio.EntityFactory({
    "Number": {
        "type": "number"
    },
    "Boolean": {
        "type": "boolean"
    },
    "String": {
        "type": "string"
    }
});
Apperyio.getModel = Apperyio.Entity.get.bind(Apperyio.Entity);

/**
 * Data storage
 */
Apperyio.storage = {

    "totalScore": new $a.LocalStorage("totalScore", "String"),

    "varEyeContact": new $a.LocalStorage("varEyeContact", "String"),

    "varFollowsPoint": new $a.LocalStorage("varFollowsPoint", "String"),

    "varImitation": new $a.LocalStorage("varImitation", "String"),

    "varPointing": new $a.LocalStorage("varPointing", "String"),

    "varResponse2Name": new $a.LocalStorage("varResponse2Name", "String"),

    "varSocialSmiles": new $a.LocalStorage("varSocialSmiles", "String"),

    "varWBB": new $a.LocalStorage("varWBB", "String"),

    "myVar": new $a.LocalStorage("myVar", "String"),

    "age": new $a.LocalStorage("age", "String"),

    "theage": new $a.LocalStorage("theage", "String"),

    "varName": new $a.LocalStorage("varName", "String"),

    "varId": new $a.LocalStorage("varId", "String"),

    "varX": new $a.LocalStorage("varX", "String"),

    "varD": new $a.LocalStorage("varD", "String"),

    "varGender": new $a.LocalStorage("varGender", "String")
};