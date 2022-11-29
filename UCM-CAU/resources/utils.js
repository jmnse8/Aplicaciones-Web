function passwordFormat(param) {
    if (param.length >= 8 && param.length <= 16) {
        var low = param.toLowerCase()
        var up = param.toUpperCase()
        if (param !== low && param !== up) {
            var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
            if (format.test(param))
                return true
        }
    }
    return false
}

function samePassword(password1, password2) {
    return password1 === password2
}

module.exports = {
    passwordFormat : passwordFormat,
    samePassword : samePassword
}