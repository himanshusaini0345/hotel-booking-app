class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Handle search text properly for different endpoints (custom handling needed)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|options|regex)\b/g, match => `$${match}`);
    let parsedQuery = JSON.parse(queryStr);

    // Apply regex properly if passed from client
    Object.keys(parsedQuery).forEach(key => {
        if(parsedQuery[key] && typeof parsedQuery[key] === 'string' && parsedQuery[key].startsWith('/')) {
            // Very simplistic - better to handle regex in controller
        }
    });

    this.query = this.query.find(parsedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    // If download flag is true, skip pagination
    if(this.queryString.download === 'true') {
      return this;
    }
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
