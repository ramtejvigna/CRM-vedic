import express from 'express';
import * as PostController from "../controllers/PostController.js"
const router = express.Router();

router.post('/posts',PostController.InsertPostData);
router.get('/posts',PostController.getPostData);
router.delete('/posts/:id', PostController.deletePost);


export default router;