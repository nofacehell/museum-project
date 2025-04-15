import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="uk-navbar-container" uk-navbar="true">
      <div className="uk-navbar-left">
        <ul className="uk-navbar-nav">
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/quizzes">Викторины</Link></li>
          <li><Link to="/exhibits">Экспонаты</Link></li>
          <li><Link to="/games">Игры</Link></li>
          <li><Link to="/admin">Админ</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
