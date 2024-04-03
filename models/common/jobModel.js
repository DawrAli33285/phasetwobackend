const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    category:{
type:String,
required:true
    },
    job_title: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    company_logo: {
        type: String,
        required: true
    },

    experience_required: {
        type: String,
        required: true
    },
    job_type: {
        type: String,
        required: true
    },
    job_description: {
        type: String,
        required: true
    },
    deadline_date: {
        type: Date,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    educational_requirements: {
        type: String,
        required: true
    },
    job_responsibility: {
        type: String,
        required: true
    },
    extra_benefits: {
        type: String,
        required: true
    },
    vacancy: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    appliedBy:{
type:[mongoose.Schema.ObjectId],
ref:'user'
    },
    bookmark:{
        type:[mongoose.Schema.ObjectId],
        ref:'user',
        required:false
    }
}, { timestamps: true });

const jobModel = mongoose.model('jobs', jobSchema);
module.exports = jobModel;
