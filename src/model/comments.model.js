import mongoose from "mongoose";

const commentsSchema = mongoose.Schema({

    title: {type: String, required: true, unique: true},
    text: {type: String, required: true, unique: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    author: {type: mongoose.Types.ObjectId, ref: 'User'},
    course: {type: mongoose.Types.ObjectId, ref: 'Course'}

},{ timestamps: true });

const Comment = mongoose.model('Comment', courseSchema);

//?-----BasicFunctions-----

export async function findRawCommentById(courseId) {
    let comment = await Comment.findOne({_id: courseId});
    if(!comment) throw new Error(`Comment with ${courseId} not found!`, {cause: 404})
    return comment;
}

export async function findRawCommentByTitle(title) {
    let comment = await Comment.findOne({title: title});
    if(!comment) throw new Error(`Comment with ${title} not found!`, {cause: 404})
    return comment;
}


//?-----AdvancedFunctions-----
