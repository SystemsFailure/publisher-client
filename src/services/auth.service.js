import { useAuthStore } from "@/stores/auth";

class AuthService {
    constructor(axiosInstance) {
        this.axios = axiosInstance;
    }

    validateLogin(login) {
        if (!login || typeof login !== 'string' || login.length < 3) {
            throw new Error('Логин должен быть строкой длиной не менее 3 символов.');
        }
    }

    validatePassword(password) {
        if (!password || typeof password !== 'string' || password.length < 6) {
            throw new Error('Пароль должен быть строкой длиной не менее 6 символов.');
        }
    }

    async register(login, password) {
        this.validateLogin(login);
        this.validatePassword(password);

        try {
            const response = await this.axios.post('/register', { login, password });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async login(login, password) {
        this.validateLogin(login);
        this.validatePassword(password);

        try {
            const response = await this.axios.post('/login', { login, password });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    logout() {
        try {
            const router = useRouter();
            router.push({ name: 'login' });
            localStorage.removeItem('token');
            localStorage.removeItem('managerId');
            localStorage.removeItem('manager');
            // Дальше запрос на выхода из системы и удаления токена из базы, куки и хедера
        } catch (error) {
            console.error(error);
        }
    }

    handleError(error) {
        if (error.response) {
            // Сервер ответил со статусом, отличным от 200
            console.error('Ошибка сервера:', error.response.data);
            throw new Error(error.response.data.message || 'Произошла ошибка сервера.');
        } else if (error.request) {
            // Запрос был отправлен, но ответа не получено
            console.error('Ошибка сети:', error.request);
            throw new Error('Произошла ошибка сети. Пожалуйста, попробуйте еще раз.');
        } else {
            // Произошло что-то еще
            console.error('Ошибка:', error.message);
            throw new Error(error.message);
        }
    }
}


export default AuthService;
