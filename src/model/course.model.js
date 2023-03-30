import mongoose from "mongoose";


const courseSchema = mongoose.Schema({

    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true }
    
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);