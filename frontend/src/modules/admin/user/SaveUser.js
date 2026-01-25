import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  clrUserStateMsg,
  createOrUpdateUserAction,
  getUserAction,
} from "../../../redux/user_store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import defaultUserImg from "../../../assets/imgs/avatar.jpg";

const SaveUser = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("id");
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isNotAdmin = window.location.pathname.includes("profile");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    profileImg: null,
  });

  const selectProfileImg = (e) => {
    const selectedFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profileImg: reader.result }));
    };
  };

  const updateFormField = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formValidation = () => {
    if (!userId) {
      return !formData.name || !formData.email || !formData.password;
    }
    return !formData.name || !formData.email;
  };

  const createOrUpdateUser = async (e) => {
    e.preventDefault();
    const payload = {
      id: userId,
      ...formData,
      isNotAdmin,
    };
    dispatch(createOrUpdateUserAction(payload));
  };

  useEffect(() => {
    if (userState.success) {
      if (!userId) {
        setFormData(
          Object.fromEntries(
            Object.keys(formData).map((key) => [
              key,
              key === "profileImg" ? null : "",
            ])
          )
        );
        toast.success(userState.success);
      } else if (isNotAdmin) {
        toast.success(userState.success);
        navigate(`/profile/${userId}`);
      } else {
        toast.success(userState.success);
        navigate("/admin/users");
      }
      dispatch(clrUserStateMsg());
    }
  }, [dispatch, userState.success, userId, navigate]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserAction({ userId }));
    } else {
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && userState.user) {
      setFormData({
        name: userState.user.name || "",
        email: userState.user.email || "",
        password: "", // keep empty for security
        role: userState.user.role || "",
        profileImg: userState.user.profileImg?.imgUrl || null,
      });
    }
  }, [userId, userState.user]);

  return (
    <div className="flex-[4]">
      <div className="w-[50%] mx-auto">
        <p className="text-center my-4 uppercase text-xl font-bold">
          {userId ? "Update" : "Create"} {isNotAdmin ? "Profile" : "User"}
        </p>
        <form onSubmit={createOrUpdateUser}>
          <div className="flex justify-center mb-5">
            <div className="relative w-fit">
              <img
                src={formData.profileImg || defaultUserImg}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                name="profileImg"
                accept="image/*"
                onChange={selectProfileImg}
              />
              <label
                htmlFor="fileInput"
                className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-800 p-1.5 rounded-full cursor-pointer shadow-md"
                title="Change profile picture"
              >
                <PhotoCameraIcon
                  style={{ color: "white", fontSize: "1.2rem" }}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center mb-5 bg-gray-200 rounded">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="p-2.5 w-full border-none outline-none text-gray-700 bg-gray-200"
              required
              value={formData.name}
              onChange={updateFormField}
            />
          </div>

          <div className="flex items-center mb-5 bg-gray-200 rounded">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-2.5 w-full border-none outline-none text-gray-700 bg-gray-200"
              required
              value={formData.email}
              onChange={updateFormField}
            />
          </div>

          <div className="flex items-center mb-5 bg-gray-200 rounded">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-2.5 w-full border-none outline-none text-gray-700 bg-gray-200"
              required={!userId}
              value={formData.password}
              onChange={updateFormField}
            />
          </div>

          {!isNotAdmin && (
            <div className="flex items-center mb-5 bg-gray-200 rounded">
              <select
                name="role"
                value={formData.role}
                onChange={updateFormField}
                className="p-2.5 w-full border-none outline-none text-gray-700 bg-gray-200"
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={formValidation()}
            className={`py-2 outline-none rouded mt-2 w-full font-bold tracking-wide flex items-center justify-center  ${
              formValidation()
                ? "bg-transparent text-gray-600 cursor-not-allowed border border-gray-600"
                : "primary_bg text-white cursor-pointer"
            }`}
          >
            {userState.loading.createOrUpdateUser ? (
              <Spinner color="aliceblue" size="1.3rem" />
            ) : (
              "SUBMIT"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SaveUser;
