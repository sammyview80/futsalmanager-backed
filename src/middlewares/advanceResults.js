const Futsal = require("../models/Futsal");
const { remove } = require("../models/Futsal");

const advanceResults = (Model, populateWith) => async (req, res, next) => {
    if(req.query){
        let query;

        // Copy req.query 
        const reqQuery = { ...req.query }

        // Field to exclude
        const removeFields = ['select', 'sort', 'limit', 'page'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte)
        queryStr = queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g, match => `$${match}`);

        // Finding resources
        query = Model.find(JSON.parse(queryStr));

        // Select Fields
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query.select(fields);
        }
        // Sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query.sort(sortBy);
        }else {
            query.sort('-createdAt');
        }
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Model.countDocuments();

        query = query.skip(startIndex).limit(limit);

        if(populateWith){
            query = query.populate(populateWith);
        }
        
        // Executing query
        const results = await query;

        // Pagination Result
        const pagination = {};
        if(endIndex < total){
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        res.advanceResults = {
            status: 'Sucess', 
            counts: results.length,
            pagination,
            data: results
        }
    }else {
        const results = await Futsal.find();
        res.advanceResults = {
            status: 'Sucess', 
            counts: results.length,
            data: results
        }
    }
    
    next();
};

module.exports = advanceResults;