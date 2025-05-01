import express from 'express';
import { registerUser, getLatestUser, getAllUsers, deleteUser, updateUser ,deleteLatestUser} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.get('/latest', getLatestUser);
userRouter.delete('/latest', deleteLatestUser); // 👈 newly added line
userRouter.get('/all', getAllUsers);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:id", updateUser);


export default userRouter;
