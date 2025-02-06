import "./asside.css";
import article_1 from "./article_1.jpg";
import article_2 from "./article_2.jpg";
import article_3 from "./article_3.jpg";
import article_4 from "./article_4.jpg";
import article_5 from "./article_5.jpg";
import article_6 from "./article_6.jpg";


function Asside() {
  return (
    <div className="asside-container">
      <aside>
        <p className="asside-text">Новости компаний за неделю</p>
        <div className="line"></div>
        <ul>
          <div className="article">
          <img className="img-article" src={article_1} alt="" />
          <a href="/">Facebook</a>
          </div>
          <div className="article">
            <img className="img-article" src={article_2} alt="" />
            <a href="/">WhatsApp</a>
          </div>
          <div className="article">
            <img className="img-article" src={article_3} alt="" />
            <a href="/">Twitter</a>
          </div>
          <div className="article">
            <img className="img-article" src={article_4} alt="" />
            <a href="/">Skype</a>
          </div>
          <div className="article">
            <img className="img-article" src={article_5} alt="" />
            <a href="/">YouTube</a>
          </div>
          <div className="article">
            <img className="img-article" src={article_6} alt="" />
            <a href="/">Pinterest</a>
          </div>
        </ul>
      </aside>
    </div>
  );
}

export default Asside;