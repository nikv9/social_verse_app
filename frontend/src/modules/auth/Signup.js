import { useState } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import ImageIcon from "@mui/icons-material/Image";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { signupAction } from "../../redux/auth_store";
import defaultUserImg from "../../assets/imgs/avatar.jpg";

const Signup = (props) => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImg, setProfileImg] = useState(null);

  const selectProfileImg = (e) => {
    const selectedFile = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = () => {
      setProfileImg(reader.result);
    };
  };

  const formValidation = () => {
    return !name || !email || !password;
  };

  const signupUser = (e) => {
    e.preventDefault();
    dispatch(signupAction({ name, email, password, profileImg }));
  };

  return (
    <div className="p-2 md:p-4">
      <form className="p-2" onSubmit={signupUser}>
        <div className="flex justify-center mb-5">
          <div className="relative w-fit">
            <img
              src={profileImg || defaultUserImg}
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
              <ImageIcon style={{ color: "white", fontSize: "1.2rem" }} />
            </label>
          </div>
        </div>
        <div className="flex items-center mb-5 border border-gray-500 rounded">
          <PersonIcon className="text-gray-400 ml-2 text-xl" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="p-2.5 w-full border-none outline-none bg-transparent"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex items-center mb-5 border border-gray-500 rounded">
          <MailOutlineIcon className="text-gray-400 ml-2 text-xl" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-2.5 w-full border-none outline-none bg-transparent"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center mb-5 border border-gray-500 rounded">
          <LockOpenIcon className="text-gray-400 ml-2 text-xl" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-2.5 w-full border-none outline-none bg-transparent"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          name="profileImg"
          accept="image/*"
          onChange={selectProfileImg}
        />

        <button
          type="submit"
          disabled={formValidation()}
          className={`py-2 outline-none rouded mt-2 w-full font-bold tracking-wide flex items-center justify-center  ${
            formValidation()
              ? "bg-transparent text-gray-600 cursor-not-allowed border border-gray-500"
              : "primary_bg text-white cursor-pointer"
          }`}
        >
          {authState.loading.signup ? (
            <Spinner color="aliceblue" size="1.3rem" />
          ) : (
            "SIGNUP"
          )}
        </button>

        <p
          className="mt-2 text-red-600 align-center underline cursor-pointer text-center hover:text-red-800"
          onClick={() => props.changeTab(1)}
        >
          Already have an account?
        </p>
      </form>
    </div>
  );
};

export default Signup;
