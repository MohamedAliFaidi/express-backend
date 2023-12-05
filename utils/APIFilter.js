class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    if (this.queryStr.keyword) {
      const keywordFilter = {
        name: {
          $regex: String(this.queryStr.keyword),
          $options: 'i',
        },
      };
      this.query = this.query.find({ ...keywordFilter });
    } else if (this.queryStr.price && this.queryStr.price.$gte) {
      const priceGte = parseFloat(this.queryStr.price.$gte);

      const price = {
        $gte: priceGte,
      };

      const priceFilter = {
        price,
      };
      this.query = this.query.find({ ...priceFilter });
    } else if (this.queryStr.price && this.queryStr.price.$lte) {
      const priceLte = parseFloat(this.queryStr.price.$lte);

      const price = {
        $lte: priceLte,
      };

      const priceFilter = {
        price,
      };
      this.query = this.query.find({ ...priceFilter });
    }
    if (
      this.queryStr.price
      && this.queryStr.price.$gte
      && this.queryStr.price.$lte
    ) {
      const priceGte = parseFloat(this.queryStr.price.$gte);
      const priceLte = parseFloat(this.queryStr.price.$lte);

      const price = {
        $gte: priceGte,
        $lte: priceLte,
      };

      const priceFilter = {
        price,
      };
      this.query = this.query.find({ ...priceFilter });
    }

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ['keyword', 'page'];
    removeFields.forEach((el) => delete queryCopy[el]);

    const output = {};
    let prop = '';


    Object.entries(queryCopy).forEach(([key, value]) => {
      if (!key.match(/\b(gt|gte|lt|lte)/)) {
        output[key] = value;
      } else {
        [prop] = key.split('[');
        const match = key?.match(/\[(.*)\]/);
        const operator = match[1];

        if (!output[prop]) {
          output[prop] = {};
        }

        output[prop][`$${operator}`] = value;
      }
    });
    // { price: { $gte: 100, $lte: 1000 } }

    this.query = this.query.find(output);
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}
module.exports = APIFilters;
