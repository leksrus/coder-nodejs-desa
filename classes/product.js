 class Product {
    constructor(id, title, price, thumbnails) {
        this.id = id ? parseInt(id) : undefined;
        this.title = title;
        this.price = parseFloat(price);
        this.thumbnails = thumbnails;
    }
}

export default Product;