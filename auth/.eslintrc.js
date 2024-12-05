module.exports = {
    extends: "airbnb-typescript-prettier",
    env: {
        "es6": true,
        "browser": true
    },
    rules: {
        "brace-style": [
            "error",
            "stroustrup"
        ],
        "comma-dangle": [
            "error",
            "never"
        ],
        "no-unused-vars": [
            "warn"
        ]
    }
}