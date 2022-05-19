import Author from "./author.js";

class Message {
    constructor(text, author) {
        this.text = text;
        this.author = new Author(author.email, author.name, author.lastname, author.age, author.alias, author.avatar)
    }
}

export default Message;