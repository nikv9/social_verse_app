import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { deletePostAction, getPostsAction } from "../../../redux/post_store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PostList = () => {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);

  const searchParams = new URLSearchParams(window.location.search);

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("currentPage")) || 1
  );
  const [perPageLimit, setPerPageLimit] = useState(
    Number(searchParams.get("perPageLimit")) || 5
  );

  const columns = [
    { field: "_id", headerName: "Post Id", width: 250 },
    { field: "createdBy", headerName: "Created By", width: 200 },
    { field: "mediaType", headerName: "Media Type", width: 150 },
    { field: "createdAt", headerName: "Created Date", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-sm"
          onClick={() => deletePost(params.row._id)}
        >
          Delete
        </button>
      ),
    },
  ];

  const deletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePostAction({ postId: id }));
    }
  };

  // Transform posts for DataGrid
  const rows = postState.posts?.posts?.map((p) => ({
    _id: p._id,
    createdBy: p.userId?.name || "Unknown",
    mediaType: p.mediaType || "text",
    createdAt: new Date(p.createdAt).toLocaleDateString("en-GB"),
  }));

  useEffect(() => {
    const queryString = `?currentPage=${currentPage}&perPageLimit=${perPageLimit}`;
    window.history.replaceState(null, "", queryString);

    dispatch(getPostsAction({ currentPage, perPageLimit }));
  }, [currentPage, perPageLimit, dispatch]);

  useEffect(() => {
    if (postState.success && !postState.success?.includes("fetched")) {
      toast.success(postState.success);
      dispatch(getPostsAction({ currentPage, perPageLimit }));
    }
  }, [postState.success, dispatch, currentPage, perPageLimit]);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows || []}
        columns={columns}
        getRowId={(row) => row._id}
        rowCount={postState.posts?.totalPosts || 0}
        paginationMode="server"
        paginationModel={{
          page: currentPage - 1,
          pageSize: perPageLimit,
        }}
        onPaginationModelChange={(model) => {
          setCurrentPage(model.page + 1);
          setPerPageLimit(model.pageSize);
        }}
        pageSizeOptions={[5, 10, 20]}
        className="dataGridContainer"
      />
    </div>
  );
};

export default PostList;
