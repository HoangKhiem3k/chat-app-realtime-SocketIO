class Users {
    constructor(){
        this.listOfUsers = []
    }
    addUser(id,name,room){
        let user = {id,name,room}
        this.listOfUsers.push(user)
    }
    getUserById(id){
        let user = this.listOfUsers.filter(user => user.id === id)[0]
        return user
    }
    removeUser(id){
        let user = this.getUserById(id)
        this.listOfUsersRemoved = this.listOfUsers.filter(user => user.id !== id)
        this.listOfUsers = this.listOfUsersRemoved
        return user
    }
    getListOfUsersInRoom(room){
        let users = this.listOfUsers.filter(user => user.room === room)
        return users
    }
}
module.exports = {
    Users
}