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


// DB-Funktion zum Erstellen eines neuen Kommentares  
export async function insertNewComment(commentBody) {
    try {
// Erstelle neue Instanz des Comment Models
        const newComment = new Comment(commentBody);

// Speichere neue Instanz       
        return await newComment.save();

    } catch (error) {
        
        if ( (error.hasOwnProperty('code')) && (error.code === 11000) ) {
           
            throw {
                code: 409,
                message: error.message
            };
        } else {
           
            throw {
                code: 400,
                message: error.message
            };
        }
    }
}