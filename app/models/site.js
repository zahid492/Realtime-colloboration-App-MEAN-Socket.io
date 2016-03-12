var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//comment schema
var CommentSchema = new Schema({
        commentContent:{
            type:String,
            required:true
        },
        author:{type: Schema.Types.ObjectId, ref: 'User'},
        createDate:{
            type:Date,
            required:false,
            default: Date.now
        }
    });
//post schema and inject comment schema
var PostSchema = new Schema({
        postContent:{
            type:String,
            required:true
        },
        author:{type: Schema.Types.ObjectId, ref: 'User'},
        comments: {type: [CommentSchema]},
        createDate:{
            type:Date,
            required:false,
            default: Date.now
        }
    });
//site schema and inject post
var SiteSchema = new Schema({
  siteName: { type: String, required: true},
  siteCode: { type: String, required: true},
  e1Code:   { type: String}, 
  bsc: { type: String, required: true},
  description: { type: String},
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
	createDate: { type: Date, default: Date.now},
	status: { type: Number, default: 1},
	posts:{type: [PostSchema]},

});



var Comment = mongoose.model('Comment', CommentSchema);
var Post = mongoose.model('Post', PostSchema);
var Site = mongoose.model('Site', SiteSchema);

module.exports = {
    Site: Site,
    Post: Post,
    Comment: Comment
};