import { loginUser, registerUser, resetUserPassword, saveResetPassword } from "./controllers/user.controller.js";

export const Routes =(app)=>{
    app.get("/health", (req,res) => {
        res.status(200)
        res.json({message:"routes health check is Ok"});
    });
    // user api's
    app.post('/api/registeruser', registerUser);
    app.post('/api/loginuser', loginUser);
    app.post('/api/password-reset', resetUserPassword);
    app.post("/api/save-password/:id/:authorization", saveResetPassword);

}