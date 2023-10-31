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
          $options: "i",
        },
      };
      this.query = this.query.find({ ...keywordFilter });
    }
    if (this.queryStr.price) {
      const priceGte = parseFloat(this.queryStr.price.gte);
      const priceLte = parseFloat(this.queryStr.price.lte);

      if (!isNaN(priceGte) && !isNaN(priceLte)) {
        const price = {
          $gte: priceGte,
          $lte: priceLte,
        };

        const priceFilter = {
          price,
        };
        this.query = this.query.find({ ...priceFilter });
      }
    }

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    let output = {};
    let prop = "";

    for (let key in queryCopy) {
      if (!key.match(/\b(gt|gte|lt|lte)/)) {
        output[key] = queryCopy[key];
      } else {
        prop = key.split("[")[0];
        console.log(prop);

        let match = key?.match(/\[(.*)\]/);
        let operator = match[1];

        if (!output[prop]) {
          output[prop] = {};
        }

        output[prop][`$${operator}`] = queryCopy[key];
      }
    }
    // { price: { $gte: 100, $lte: 1000 } }

    this.query = this.query.find(output);
    return this;
  }
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    console.log(
      `Current Page: ${currentPage}, Skip: ${skip}, Limit: ${resPerPage}`
    );

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}
module.exports = APIFilters;
