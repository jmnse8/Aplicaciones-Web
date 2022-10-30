
function createUser(request){
    let user = {
        email: request.body.email,
        name: request.body.name,
        password: request.body.password
    };
    return user;
}