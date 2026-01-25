import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../../modules/admin/user/UserList";
import { useDispatch } from "react-redux";
import { getUsersAction } from "../../redux/user_store";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    userName: "",
    sortType: "asc",
  });

  const filterUsers = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    dispatch(
      getUsersAction({
        isAdmin: "true",
        userName: updatedFilters.userName,
        sortType: updatedFilters.sortType,
      })
    );
  };

  return (
    <div className="flex-[4]">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold">USER LIST</p>
          <div className="flex gap-2">
            <input
              type="text"
              name="userName"
              value={filters.userName}
              onChange={filterUsers}
              placeholder="Search user"
              className="p-2 outline-none border text-sm bg-transparent"
            />
            <select
              name="sortType"
              value={filters.sortType}
              onChange={filterUsers}
              className="p-2 outline-none border text-sm text-gray-400 bg-transparent"
            >
              <option value="asc" className="dark:bg-[#082329]">
                Asc
              </option>
              <option value="desc" className="dark:bg-[#082329]">
                Desc
              </option>
            </select>
          </div>
          <div
            className="bg-green-600 text-white p-2 rounded-md text-[0.8rem] cursor-pointer"
            onClick={() => navigate("/user?mode=add")}
          >
            ADD NEW USER
          </div>
        </div>

        <div className="mt-2">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default Users;
