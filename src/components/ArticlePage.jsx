import styles from "../styles/articlepage.module.css";
import { useState, useEffect } from "react";
import { getArticleByID } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArticleVoteTracker } from "./ArticleVotesTracker";
import { Loading } from "./Loading";
import { CommentList } from "./CommentList";


export const ArticlePage = () => {
  const [article, setArticle] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getArticleByID(params.article_id).then((res) => {
      if(res.response){
        navigate('/404')
      }
      setArticle(res);
      setIsLoading(false);
    });
  }, [params.article_id, navigate]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className={styles.articlecard}>
        <div className={styles.topbanner}>
          <div className={styles.articletopic}>
            <Link to={`/articles/${article.topic}`}>{article.topic}</Link>
          </div>
          <ArticleVoteTracker
            votes={article.votes}
            articleID={params.article_id}
          />
        </div>

        <div className={styles.articlebody}>
          <h2>{article.title}</h2>
          <div className={styles.topicauthor}>
            <div className={styles.articleauthor}>
              Author: {article.author}
            </div>
          </div>
          <p className={styles.articlecontent}>{article.body}</p>
        </div>
      </div>
      <CommentList articleID={params.article_id} />
    </>
  );
};
