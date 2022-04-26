import  { readFile, writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';

class Container {
  constructor(fileName) {
    this.fileName = fileName;
  }

  async saveNew(object) {
    try {
      const isExist = existsSync(this.fileName);
      let arrayData = [];

      if (isExist) {
        const data = await readFile(this.fileName, "utf8");
        arrayData = JSON.parse(data);
        arrayData.push(object);
        const content = JSON.stringify(arrayData);
        await writeFile(this.fileName, content);

        return object.id;
      }

      arrayData.push(object);
      const content = JSON.stringify(arrayData);
      await writeFile(this.fileName, content);

    } catch (error) {
      console.log(error);
    }
  }

  
  async saveUpdate(object) {
    try {
      const isExist = existsSync(this.fileName);
      let arrayData = [];

      if (isExist) {
        const data = await readFile(this.fileName, "utf8");
        arrayData = JSON.parse(data);
        const products = arrayData.filter(x => x.id !== object.id);
        products.push(object);
        const content = JSON.stringify(products);
        await writeFile(this.fileName, content);
      
        return true;
      }

      return false;

    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const data = await readFile(this.fileName, "utf8");

      if (data) {
        const arrayData = JSON.parse(data);
        const product = arrayData.find((x) => parseInt(x.id) === parseInt(id));

        if (product) return product;

        return null;
      }

      return null;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      const data = await readFile(this.fileName, "utf8");

      if (data) return JSON.parse(data);

      return [];
    } catch (error) {
      console.log(error);
    }
  }

  async deletById(id) {
    try {
      const data = await readFile(this.fileName, "utf8");

      if (data) {
        const arrayData = JSON.parse(data);
        const filteredArray = arrayData.filter((x) => x.id !== id);
        const content = JSON.stringify(filteredArray);
        await writeFile(this.fileName, content);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    try {
      await unlink(this.fileName);
    } catch (error) {
      console.log(error);
    }
  }
}

export default Container;
