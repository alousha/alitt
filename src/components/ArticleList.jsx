import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userContext } from "../contexts/user";
import styles from "../styles/articlelist.module.css";
import { getArticles, postArticle } from "../utils/api";
import { ArticleCard } from "./ArticleCard";
import { Loading } from "./Loading";
import { NewArticle } from "./NewArticle";

export const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState();
  const [orderParams, setOrderParams] = useState("DESC");
  const [ascClicked, setAscClicked] = useState(false);
  const [descClicked, setDescClicked] = useState(true);
  const [newArticle, setNewArticle] = useState(false);
  const [articleToPost, setArticleToPost] = useState("");
  const [articleTopicToPost, setArticleTopicToPost] = useState("");
  const [articleTitleToPost, setArticleTitleToPost] = useState("");

  const { user } = useContext(userContext);
  const navigate = useNavigate();

  let sortBy = [
    { value: "created_at", name: "Date" },
    { value: "comment_count", name: "Comments" },
    { value: "votes", name: "Hottest" },
  ];

  const params = useParams();

  const handleSort = (event) => {
    setSearchParams(event.target.value);
  };

  let ascButtonClicked = styles.orderbut;
  if (ascClicked) {
    ascButtonClicked = styles.buttonselected;
  }

  let descButtonClicked = styles.orderbut;
  if (descClicked) {
    descButtonClicked = styles.buttonselected;
  }

  const handleOrderAsc = (event) => {
    setAscClicked(!ascClicked);
    setDescClicked(!descClicked);
    setOrderParams(event.target.value);
  };

  const handleOrderDesc = (event) => {
    setDescClicked(!descClicked);
    setAscClicked(!ascClicked);
    setOrderParams(event.target.value);
  };

  function handleNewPost() {
    setNewArticle(!newArticle);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setNewArticle(false)
    setArticles((oldArticles) => {
      let newArticles = [
        {
          title: articleTitleToPost,
          topic: articleTopicToPost,
          body: articleToPost,
          author: user.username,
        },
        ...oldArticles,
      ];
      return newArticles;
    });
    postArticle({
      title: articleTitleToPost,
      topic: articleTopicToPost,
      body: articleToPost,
      author: user.username,
    })
      .then(() => {
        setArticleTitleToPost("");
        setArticleTopicToPost("");
        setArticleToPost("");
      })
      .catch((err) => {
        console.log(err);
        alert("Sorry we couldn't post your article, try again later");
      });
  }

  useEffect(() => {
    getArticles(params.topic, searchParams, orderParams).then((res) => {
      if (res.response) {
        navigate("/404");
      }
      setArticles(res);
      setIsLoading(false);
    });
  }, [params.topic, searchParams, orderParams, navigate, articleToPost]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.filterbar}>
        <div className={styles.orderbox}>
          <select
            className={styles.searchparams}
            value={searchParams}
            onChange={handleSort}
          >
            <option value="">Sort articles by</option>
            {sortBy.map((option, index) => {
              return (
                <option value={option.value} key={index}>
                  {option.name}
                </option>
              );
            })}
          </select>
          <button
            value="ASC"
            onClick={handleOrderAsc}
            className={ascButtonClicked}
          >
            ASC
          </button>
          <div className={styles.divider}></div>
          <button
            value="DESC"
            onClick={handleOrderDesc}
            className={descButtonClicked}
          >
            DESC
          </button>
        </div>
        {user.username ? (
          <button onClick={handleNewPost} className={styles.postbut}>
            New Post
          </button>
        ) : (
          ""
        )}
      </div>
      <div className={styles.newpostcard}>
        {newArticle ? (
          <NewArticle
            setArticleTitleToPost={setArticleTitleToPost}
            setArticleToPost={setArticleToPost}
            handleSubmit={handleSubmit}
            setArticleTopicToPost={setArticleTopicToPost}
            articleTitleToPost={articleTitleToPost}
            articleTopicToPost={articleTopicToPost}
            articleToPost={articleToPost}
          />
        ) : (
          ""
        )}
      </div>
      <div>
        <ul>
          {articles.map((article, index) => {
            return <ArticleCard key={index} article={article} />;
          })}
        </ul>
      </div>
    </>
  );
};
