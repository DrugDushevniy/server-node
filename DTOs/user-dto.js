module.exports = class UserDto {
    id;
    username;
    roles;

    constructor(model) {
        console.log(model)
        this.id = model._id;
        this.username = model.username;
        this.roles = model.roles;
    }
}