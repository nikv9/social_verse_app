import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsAction } from "../../redux/post_store";
import MetaData from "../../components/MetaData";
import CreatePost from "../../modules/home/CreatePost";
import Post from "../../modules/home/Post";
import Spinner from "../../components/Spinner";

const Home = () => {
  const postState = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await dispatch(getPostsAction({ currentPage: page }));
      // Merge new posts with old ones
      if (res?.posts?.length) {
        setPosts((prev) => [...prev, ...res.posts]);
        const total = res.totalPosts;
        const loaded = page * res.posts.length;
        setHasMore(loaded < total);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
  }, [dispatch, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // intersection observer to trigger next page
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !postState.loading.getPosts) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, postState.loading.getPosts]);

  useEffect(() => {
    if (!postState.posts?.posts) return;
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postState.posts.posts.find((x) => x._id === p._id)?._id
          ? postState.posts.posts.find((x) => x._id === p._id)
          : p
      )
    );
  }, [postState.posts]);

  return (
    <>
      <MetaData title="cnectify - Home" />
      <div className="flex flex-wrap flex-[4] p-5">
        {/* Feed */}
        <div className="w-full">
          <CreatePost
            fetchPosts={fetchPosts}
            setPosts={setPosts}
            setPage={setPage}
          />

          {page === 1 && postState.loading.getPosts ? (
            <div className="flex items-center justify-center h-[50vh]">
              <Spinner color="crimson" size="3rem" />
            </div>
          ) : (
            <>
              <div className="postContainer">
                {posts.length === 0 && !postState.loading.getPosts ? (
                  <p className="text-gray-500 text-sm text-center py-5">
                    No posts available.
                  </p>
                ) : (
                  posts.map((item) => <Post post={item} key={item._id} />)
                )}
              </div>

              {/* loader or end text */}
              <div
                ref={observerRef}
                className="flex justify-center items-center py-5"
              >
                {postState.loading.getPosts ? (
                  <Spinner color="crimson" size="2rem" />
                ) : (
                  !hasMore &&
                  posts.length > 0 && (
                    <p className="text-gray-500 text-sm">
                      You've reached the end of posts.
                    </p>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
