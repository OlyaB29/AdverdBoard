import {useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from "../hook/useAuth";
import AdvertBoardService from "./AdvertBoardService";

const advertBoardService = new AdvertBoardService();

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {signIn} = useAuth();
    const fromPage = location.state?.from?.pathname || '/';
    const HandleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const user = form.username.value;
        const password = form.password.value;
        advertBoardService.getTokens(user, password).then(function (result) {
            console.log(result);
            advertBoardService.getUser(result.access).then(function (res) {
                console.log(res);
                signIn(user, result.access, result.refresh, res.id, () => navigate(fromPage, {replace: true}))
            })
        })
    }

    return (
        <div>
            <main className="form-signin m-auto">
                <form onSubmit={HandleSubmit}>
                    <h2>Авторизуйтесь, пожалуйста</h2>
                    <div className="form-floating">
                        <input className="form-control" name='username' placeholder="Имя пользователя"/>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" name='password' placeholder="Пароль"/>
                    </div>
                    <button className="w-100 btn btn-success" type="submit">Войти</button>
                </form>
            </main>
        </div>
    );
}

export {LoginPage}