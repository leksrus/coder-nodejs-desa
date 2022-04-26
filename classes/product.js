 class Product {
    constructor(id, title, price, thumbnails) {
        this.id = parseInt(id);
        this.title = title;
        this.price = parseFloat(price);
        this.thumbnails = thumbnails;
    }
}

export default Product;