import {Link} from 'react-router-dom'

const ErrorPage = () => {
    return (
        <div>
            <h1>Вы перешли на несуществующую страницу</h1>
            <Link to='/'>Назад</Link>
        </div>
        
    )
}

export default ErrorPage;