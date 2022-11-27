export function emailFormat() {
    let emailFormat = "/\S+@\S+\.\S+/";
    return emailFormat.test(this)
}

export function passwordFormat() {
    if (this.lenght >= 8 && this.lenght <= 16){
        var low = this.toLowerCase()
        var up = this.toUpperCase()
        if (this !== low && this !== up) {
            var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
            if (format.test(this))
                return true
        }
    }
    return false
}

export function samePassword(password) {
    return this == password
}